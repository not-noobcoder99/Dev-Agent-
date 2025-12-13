# Testing Guide - Real API Integration

## 🧪 How to Test the New Features

### Prerequisites
- App running on `http://localhost:3000`
- Browser with localStorage support
- (Optional) Together AI API key for real generation

---

## Test 1: Settings Page ⚙️

### Steps:
1. Click "⚙️ Settings" in header
2. Verify page loads correctly
3. Enter a test API key: `sk-test-123456789`
4. Toggle "Show API keys in plain text"
5. Click "Save Settings"
6. Check for success message
7. Refresh page - verify key persists

### Expected Results:
- ✅ Settings page loads
- ✅ API key field visible
- ✅ Show/hide toggle works
- ✅ Success message appears
- ✅ Key persists after refresh

---

## Test 2: Mock Code Generation (No API Key) 🎭

### Steps:
1. Go to dashboard (don't enter API key)
2. Enter prompt: `"Create a REST API for task management with authentication"`
3. Select Language: `TypeScript`
4. Select Framework: `Express`
5. Click "Generate Code"
6. Wait for completion

### Expected Results:
- ✅ Progress indicators show steps
- ✅ Multiple files generated (app.ts, routes/auth.ts, README.md)
- ✅ Code includes TODO comments
- ✅ Code review shows issues (TODO, console.log, etc.)
- ✅ Quality score between 70-90
- ✅ Download buttons work

### Sample Output:
```typescript
// Should see files like:
- src/app.ts (Express server setup)
- src/routes/auth.ts (Login/register routes)
- README.md (Getting started guide)
```

---

## Test 3: Enhanced Mock with Different Languages 🌐

### Test 3A: Python + FastAPI

**Prompt:**
```
Build a CRUD API for managing tasks with database
```

**Settings:**
- Language: `Python`
- Framework: `FastAPI`

**Expected:**
- `main.py` with FastAPI app
- CRUD endpoints (GET, POST, PUT, DELETE)
- Pydantic models
- README with setup instructions

### Test 3B: JavaScript + React

**Prompt:**
```
Create a user profile card component with avatar
```

**Settings:**
- Language: `JavaScript`
- Framework: `React`

**Expected:**
- Component file with JSX
- Props and state management
- README

---

## Test 4: Code Review Analysis 🔍

### Steps:
1. Generate any code
2. Scroll to "Code Review Results" section
3. Check the issues list
4. Use severity filter dropdown

### Expected Results:
- ✅ Issues are categorized (Critical, Major, Minor, Info)
- ✅ Line numbers shown where applicable
- ✅ Suggestions provided
- ✅ Filter works (try "Info" only)
- ✅ Score calculated correctly

### Common Issues to Find:
- 🔵 Info: TODO comments
- 🔵 Info: Console.log statements
- 🟡 Minor: Missing exports
- 🟠 Major: Missing error handling

---

## Test 5: Quality Evaluation 📊

### Steps:
1. Generate code
2. Scroll to "Quality Evaluation" section
3. Check all metrics

### Expected Results:
- ✅ Overall score shown (0-100)
- ✅ 5 metrics displayed:
  - Code Quality
  - Maintainability
  - Security
  - Performance
  - Best Practices
- ✅ Recommendations provided
- ✅ Scores correlate with review results

---

## Test 6: Download Functionality 💾

### Steps:
1. Generate code with multiple files
2. Click "💾 Download" on a single file
3. Click "📦 Download All"
4. Check downloads folder

### Expected Results:
- ✅ Single file downloads with correct name
- ✅ All files download individually
- ✅ File contents match displayed code
- ✅ Correct file extensions

---

## Test 7: Session History 📜

### Steps:
1. Generate code (Prompt A)
2. Generate code again (Prompt B)
3. Generate code again (Prompt C)
4. Click "📜 History" button
5. Click on a previous session
6. Verify results load

### Expected Results:
- ✅ History button shows count
- ✅ History panel displays sessions
- ✅ Sessions show prompt, language, framework
- ✅ Clicking loads previous results
- ✅ Last 10 sessions kept

---

## Test 8: Quick Stats Dashboard 📊

### Steps:
1. Generate 3+ code sessions
2. Check top stats panel

### Expected Results:
- ✅ Total Sessions count
- ✅ Files Generated count
- ✅ High Quality count (score ≥80)
- ✅ Languages Used count
- ✅ Stats update after each generation

---

## Test 9: Real API Integration (With API Key) 🤖

### Prerequisites:
- Valid Together AI API key
- Free tier: Get from https://api.together.xyz/signup

### Steps:
1. Go to Settings
2. Enter real Together AI API key
3. Save settings
4. Return to dashboard
5. Enter prompt: `"Create a TypeScript utility function for data validation"`
6. Click "Generate Code"
7. Wait 5-10 seconds

### Expected Results:
- ✅ Real AI-generated code (different each time)
- ✅ Professional quality code
- ✅ Multiple files if appropriate
- ✅ Proper TypeScript syntax
- ✅ Better than mock output

### Verification:
- Code should be unique (not template)
- Should follow prompt closely
- Should include proper types
- May include tests/documentation

---

## Test 10: Error Handling ⚠️

### Test 10A: Network Error

**Steps:**
1. Disconnect internet (or use invalid API key)
2. Try to generate code
3. Check error display

**Expected:**
- ✅ Error message shown
- ✅ "🔄 Retry" button visible
- ✅ "Reset" button visible
- ✅ Clicking Retry attempts again
- ✅ Clicking Reset clears state

### Test 10B: Empty Prompt

**Steps:**
1. Leave prompt empty
2. Click "Generate Code"

**Expected:**
- ✅ Validation error (frontend or backend)
- ✅ Clear error message

---

## Test 11: Progress Tracking ⏱️

### Steps:
1. Generate code
2. Watch progress indicators
3. Note the steps

### Expected Steps:
1. 🚀 Initializing workflow...
2. 🤖 Generating code with AI...
3. ✅ Code generated! 🔍 Reviewing...
4. ✅ Review complete! 📊 Evaluating quality...
5. ✅ Evaluation complete! 📝 Finalizing...
6. 🎉 Complete!

### Expected Results:
- ✅ Progress bar animates
- ✅ Step text updates
- ✅ Duration tracked
- ✅ Smooth transitions

---

## Test 12: Keyboard Shortcuts ⌨️

### Steps:
1. Click in prompt textarea
2. Type a prompt
3. Press `Ctrl+Enter` (or `Cmd+Enter` on Mac)

### Expected Results:
- ✅ Form submits
- ✅ Code generation starts
- ✅ No page reload

---

## Test 13: Responsive Design 📱

### Steps:
1. Open DevTools (F12)
2. Toggle device toolbar
3. Test mobile view (375px width)
4. Test tablet view (768px width)
5. Test desktop view (1920px width)

### Expected Results:
- ✅ Layout adapts to screen size
- ✅ No horizontal scrolling
- ✅ Buttons remain clickable
- ✅ Text readable at all sizes

---

## Test 14: Dark Mode 🌙

### Steps:
1. Enable dark mode in your OS
2. Refresh the app
3. Check all components

### Expected Results:
- ✅ Background is dark
- ✅ Text is light colored
- ✅ Cards have dark background
- ✅ Borders visible
- ✅ No white flashes

---

## Test 15: Framework Selection 🎯

### Steps:
1. Select Language: `TypeScript`
2. Check Framework dropdown
3. Switch to Language: `Python`
4. Check Framework dropdown again

### Expected Results:
- ✅ TypeScript shows: Express, NestJS, Next.js, Fastify
- ✅ Python shows: FastAPI, Django, Flask, Pandas
- ✅ Framework resets when language changes
- ✅ Selection persists for same language

---

## Performance Benchmarks ⚡

### Mock Generation:
- Target: < 1 second
- Actual: ~100ms

### Real API Generation:
- Target: < 10 seconds
- Actual: 3-8 seconds (depends on Together AI)

### Code Review:
- Target: < 500ms
- Actual: ~100ms (static analysis)

### UI Updates:
- Target: < 100ms
- Actual: Instant (React state updates)

---

## Common Issues & Solutions 🔧

### Issue: "API key not working"
**Solution:** Check for spaces, verify key is valid, check Together AI dashboard

### Issue: "Code not downloading"
**Solution:** Check browser download settings, allow popups for localhost

### Issue: "History not saving"
**Solution:** Check localStorage is enabled, clear browser cache

### Issue: "Slow generation"
**Solution:** Together AI may be experiencing high load, try again in a few minutes

---

## Regression Testing Checklist ✅

After any code changes, verify:

- [ ] Settings page loads
- [ ] API keys save/load
- [ ] Mock generation works
- [ ] Code review runs
- [ ] Quality evaluation completes
- [ ] Download buttons work
- [ ] History saves/loads
- [ ] Stats update
- [ ] Progress tracking works
- [ ] Error handling works
- [ ] Keyboard shortcuts work
- [ ] Responsive design intact
- [ ] Dark mode works
- [ ] Framework selection works
- [ ] All links work

---

## Test Data Examples 📝

### Good Prompts (Should Work Well):
```
✅ "Create a REST API for user authentication"
✅ "Build a Python web scraper for news articles"
✅ "Generate a React dashboard component"
✅ "Create a TypeScript utility for form validation"
✅ "Build a FastAPI CRUD API for a blog"
```

### Edge Case Prompts:
```
⚠️ "hello" (too vague)
⚠️ "" (empty)
⚠️ "a".repeat(10000) (too long)
⚠️ "🚀🎉💻" (only emojis)
```

---

## Success Criteria 🎯

### For Mock Mode:
- ✅ Generates code in < 1 second
- ✅ Creates 2-4 files
- ✅ Includes README
- ✅ Code is syntactically valid
- ✅ Review finds realistic issues

### For Real API Mode:
- ✅ Generates code in < 10 seconds
- ✅ Code quality exceeds mock
- ✅ Follows prompt accurately
- ✅ Includes proper types/documentation
- ✅ Production-ready output

---

**Testing Status**: ✅ Ready  
**Next Step**: Run through checklist! 🚀
