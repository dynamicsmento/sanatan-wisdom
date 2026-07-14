const http = require('http');
const { spawn } = require('child_process');

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

const makeRequest = (options, postData = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: JSON.parse(body)
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: body
          });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('Starting Endpoint Verification Tests...');
  let tokens = { accessToken: '', refreshToken: '' };
  let testBookId = '';
  let testChapterId = '';
  let testNoteId = '';
  let testBookmarkId = '';

  try {
    // 1. Verify health check
    console.log('\n--- Test 1: Verify Health Check ---');
    const health = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/health',
      method: 'GET'
    });
    console.log(`Health Status Code: ${health.statusCode}`);
    console.log(`Health Response: ${JSON.stringify(health.data)}`);

    // 2. Test User Signup
    console.log('\n--- Test 2: User Signup ---');
    const randomUser = `user_${Math.round(Math.random() * 10000)}`;
    const signupData = {
      username: randomUser,
      email: `${randomUser}@example.com`,
      password: 'password123'
    };
    const signupRes = await makeRequest(
      {
        hostname: 'localhost',
        port: PORT,
        path: '/api/auth/signup',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      signupData
    );
    console.log(`Signup Status Code: ${signupRes.statusCode}`);
    console.log(`Signup Response: ${JSON.stringify(signupRes.data)}`);

    // 3. Test User Login
    console.log('\n--- Test 3: User Login ---');
    const loginData = {
      username: signupData.username,
      password: signupData.password
    };
    const loginRes = await makeRequest(
      {
        hostname: 'localhost',
        port: PORT,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      loginData
    );
    console.log(`Login Status Code: ${loginRes.statusCode}`);
    console.log(`Login Response: ${JSON.stringify(loginRes.data)}`);

    if (loginRes.data && loginRes.data.success) {
      tokens.accessToken = loginRes.data.data.accessToken;
      tokens.refreshToken = loginRes.data.data.refreshToken;
      console.log('Access Token acquired!');
    } else {
      console.log('Skipping protected endpoint tests as login failed.');
      return;
    }

    // 4. Test Fetch Profile (Protected)
    console.log('\n--- Test 4: Fetch User Profile ---');
    const profileRes = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/profile',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`
      }
    });
    console.log(`Profile Status: ${profileRes.statusCode}`);
    console.log(`Profile Response: ${JSON.stringify(profileRes.data)}`);

    // 5. Test Fetch Books List
    console.log('\n--- Test 5: Fetch Books ---');
    const booksRes = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/books',
      method: 'GET'
    });
    console.log(`Books Status: ${booksRes.statusCode}`);
    console.log(`Books Total count: ${booksRes.data?.data?.books?.length || 0}`);

    if (booksRes.data?.data?.books?.length > 0) {
      testBookId = booksRes.data.data.books[0]._id;
      console.log(`Using existing book ID for testing: ${testBookId}`);

      // 6. Test Fetch Chapters of Book
      console.log('\n--- Test 6: Fetch Chapters ---');
      const chaptersRes = await makeRequest({
        hostname: 'localhost',
        port: PORT,
        path: `/api/books/${testBookId}/chapters`,
        method: 'GET'
      });
      console.log(`Chapters Status: ${chaptersRes.statusCode}`);
      console.log(`Chapters Response Count: ${chaptersRes.data?.data?.chapters?.length || 0}`);

      if (chaptersRes.data?.data?.chapters?.length > 0) {
        testChapterId = chaptersRes.data.data.chapters[0]._id;

        // 7. Test Bookmark Chapter
        console.log('\n--- Test 7: Add Bookmark ---');
        const bookmarkRes = await makeRequest(
          {
            hostname: 'localhost',
            port: PORT,
            path: '/api/bookmarks',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${tokens.accessToken}`
            }
          },
          { book: testBookId, chapter: testChapterId }
        );
        console.log(`Bookmark Status: ${bookmarkRes.statusCode}`);
        console.log(`Bookmark Response: ${JSON.stringify(bookmarkRes.data)}`);

        if (bookmarkRes.data?.success) {
          testBookmarkId = bookmarkRes.data.data.bookmark._id;
        }

        // 8. Test Write Note
        console.log('\n--- Test 8: Create Note ---');
        const noteRes = await makeRequest(
          {
            hostname: 'localhost',
            port: PORT,
            path: '/api/notes',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${tokens.accessToken}`
            }
          },
          {
            book: testBookId,
            chapter: testChapterId,
            content: 'This is a test note on Sanatan teachings.',
            isPrivate: true
          }
        );
        console.log(`Note Status: ${noteRes.statusCode}`);
        console.log(`Note Response: ${JSON.stringify(noteRes.data)}`);

        if (noteRes.data?.success) {
          testNoteId = noteRes.data.data.note._id;
        }

        // 9. Test Reading Progress Save
        console.log('\n--- Test 9: Save Reading Progress ---');
        const progressRes = await makeRequest(
          {
            hostname: 'localhost',
            port: PORT,
            path: '/api/progress',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${tokens.accessToken}`
            }
          },
          {
            book: testBookId,
            chapter: testChapterId,
            progressPercent: 45.5,
            lastReadPosition: 1200
          }
        );
        console.log(`Progress Status: ${progressRes.statusCode}`);
        console.log(`Progress Response: ${JSON.stringify(progressRes.data)}`);

        // 10. Test Get Continue Reading
        console.log('\n--- Test 10: Continue Reading List ---');
        const continueRes = await makeRequest({
          hostname: 'localhost',
          port: PORT,
          path: '/api/progress/continue',
          method: 'GET',
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`
          }
        });
        console.log(`Continue Status: ${continueRes.statusCode}`);
        console.log(`Continue Response: ${JSON.stringify(continueRes.data)}`);
      }
    }

    // 11. Test Global Search
    console.log('\n--- Test 11: Search API ---');
    const searchRes = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/search?q=test',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`
      }
    });
    console.log(`Search Status: ${searchRes.statusCode}`);
    console.log(`Search Response: ${JSON.stringify(searchRes.data)}`);

    console.log('\n====================================');
    console.log('ENDPOINT VERIFICATION TESTING COMPLETE');
    console.log('====================================');
  } catch (error) {
    console.error('Test execution failed:', error.message);
  }
};

// Spawn server if run directly
const serverProc = spawn('node', ['backend/server.js'], {
  stdio: 'inherit',
  shell: true
});

console.log('Starting Backend Server process...');
setTimeout(() => {
  runTests().then(() => {
    console.log('Stopping test backend server...');
    serverProc.kill();
    process.exit(0);
  });
}, 3000); // Allow server 3 seconds to spin up and connect to MongoDB
