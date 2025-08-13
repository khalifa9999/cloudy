# Troubleshooting Guide

## Firebase Permission Errors

### Error: "Missing or insufficient permissions"

This error typically occurs when:

1. **Collection doesn't exist yet**
   - The `atvParts` collection hasn't been created
   - Solution: Manually add your first product through the admin panel

2. **Firestore rules are too restrictive**
   - Check your `firestore.rules` file
   - Ensure the `atvParts` collection has `allow read: if true;`

3. **Authentication issues**
   - User might not be authenticated
   - Check if you're logged in to the admin panel

### Solutions:

#### Option 1: Manual Collection Creation (Recommended)
1. Go to `/admin/products`
2. Click the "Add Product" button
3. Fill in the product details
4. Save the product to create the collection

#### Option 2: Firebase Console Collection Creation
#### Option 2: Firebase Console Collection Creation
1. Go to Firebase Console
2. Navigate to Firestore Database
3. Click "Start collection"
4. Collection ID: `atvParts`
5. Add a test document

#### Option 3: Check Firestore Rules
Ensure your `firestore.rules` contains:
```javascript
match /atvParts/{partId} {
  allow read: if true; // Allow public read access
  allow write: if request.auth != null; // Allow authenticated users to write
}
```

## Common Issues and Solutions

### 1. Products Not Loading
- **Cause**: Collection doesn't exist or is empty
- **Solution**: Manually add products through the admin panel

### 2. Images Not Displaying
- **Cause**: Image URLs are invalid or images don't exist
- **Solution**: 
  - Check image URLs in product data
  - Ensure images are uploaded to Imgur or your CDN
  - Use placeholder images for testing

### 3. Categories Not Working
- **Cause**: Category names don't match between admin and shop
- **Solution**: 
  - Ensure category names are exactly the same
  - Check for typos or extra spaces
  - Use the predefined category list

### 4. Search Not Working
- **Cause**: Firestore doesn't support full-text search
- **Solution**: 
  - Search is currently client-side only
  - Consider implementing Algolia or similar service for production

### 5. Admin Panel Access Issues
- **Cause**: User not authenticated or not admin
- **Solution**:
  - Ensure user is logged in
  - Check if user has admin role in Firestore
  - Use the promote user script if needed

## Development Setup

### 1. Firebase Configuration
Ensure your `lib/firebase.js` has the correct configuration:
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // ... other config
};
```

### 2. Environment Variables
If using environment variables, ensure they're set:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
```

### 3. Firestore Rules
Deploy updated rules:
```bash
firebase deploy --only firestore:rules
```

## Testing the System

### 1. Test Product Addition
1. Go to `/admin/products`
2. Click "Add Product"
3. Fill in all required fields
4. Save the product
5. Verify it appears in the shop

### 2. Test Product Management

### 3. Test Filtering
1. Go to `/shop`
2. Try filtering by category
3. Try filtering by brand
4. Try searching for products

### 4. Test Product Display
1. Go to `/shop`
2. Check that product cards show all relevant information
3. Test expanded view for additional details
4. Verify images are displaying correctly

## Performance Optimization

### 1. Image Optimization
- Use compressed images
- Consider using Next.js Image component
- Implement lazy loading

### 2. Database Optimization
- Add indexes for frequently queried fields
- Use pagination for large datasets
- Implement caching strategies

### 3. Search Optimization
- Consider implementing server-side search
- Use Algolia or similar service
- Implement search suggestions

## Support

If you continue to experience issues:

1. Check the browser console for detailed error messages
2. Verify Firebase configuration
3. Check Firestore rules
4. Ensure all dependencies are installed
5. Try clearing browser cache
6. Check if the issue occurs in incognito mode

## Common Error Messages

### "FirebaseError: Missing or insufficient permissions"
- Collection doesn't exist or rules are too restrictive
- Solution: Add your first product manually or check Firestore rules

### "FirebaseError: Collection not found"
- Collection hasn't been created yet
- Solution: Add your first product through the admin panel

### "FirebaseError: Invalid query"
- Query syntax error or missing indexes
- Solution: Check query syntax and add required indexes

### "FirebaseError: Unauthenticated"
- User not logged in
- Solution: Ensure user is authenticated
