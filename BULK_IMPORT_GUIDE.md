# Bulk Import Guide - PowerSports Parts Catalog

## Overview

The bulk import feature allows you to add multiple products to your catalog at once using Excel (.xlsx, .xls), CSV, or JSON files. This is perfect for importing large product catalogs or updating existing products.

## Accessing the Import Feature

1. Navigate to your admin panel: `/admin`
2. Click on "Import" in the navigation menu
3. Or go directly to: `/admin/import`

## Supported File Formats

### 1. Excel Files (.xlsx, .xls)
- **Best for**: Large datasets, complex formatting, multiple sheets
- **Features**: 
  - Supports multiple worksheets
  - Preserves formatting
  - Handles complex data types
  - Auto-detects data types

### 2. CSV Files (.csv)
- **Best for**: Simple data, compatibility with spreadsheet software
- **Features**:
  - Universal compatibility
  - Lightweight
  - Easy to edit in any text editor
  - Fast processing

### 3. JSON Files (.json)
- **Best for**: Programmatic imports, API integrations
- **Features**:
  - Structured data format
  - Supports complex nested data
  - Easy to generate programmatically

## File Structure Requirements

### Required Fields
These fields must be present in your import file:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `name` | Text | Product name | "Kawasaki Brute Force 750 Air Filter" |
| `brand` | Text | Manufacturer brand | "Kawasaki" |
| `category` | Text | Product category | "Air Intake & Filters" |
| `price` | Number | Product price | 45.99 |

### Optional Fields
These fields enhance your product listings:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `vehicleType` | Text | Vehicle type | "ATV", "UTV", "Motorcycle" |
| `model` | Text | Vehicle model | "Brute Force", "RZR XP 1000" |
| `year` | Text | Year range | "2020-2024" |
| `material` | Text | Product material | "Stainless Steel" |
| `function` | Text | Product function | "High-performance air filter" |
| `weight` | Text | Product weight | "0.5 lbs" |
| `condition` | Text | Product condition | "New", "Used" |
| `partNumber` | Text | Part number | "KAF-750-2020" |
| `description` | Text | Detailed description | "Premium air filter..." |
| `specifications` | Text | Technical specs | "Filter Type: Dual-layer..." |
| `warranty` | Text | Warranty information | "1 Year Limited Warranty" |
| `stockQuantity` | Number | Available stock | 25 |
| `originalPrice` | Number | Original price | 59.99 |
| `rating` | Number | Product rating (0-5) | 4.8 |
| `reviews` | Number | Number of reviews | 127 |
| `status` | Text | Product status | "Active", "Inactive" |
| `images` | Text | Image URLs (comma-separated) | "url1.jpg,url2.jpg" |

## Step-by-Step Import Process

### Step 1: Prepare Your File

1. **Download a Template**:
   - Click "Download Template" in the import page
   - Choose between CSV or Excel format
   - Use the template as a starting point

2. **Format Your Data**:
   - Ensure all required fields are filled
   - Use consistent formatting for dates, prices, etc.
   - Separate multiple image URLs with commas
   - Use quotes around text that contains commas

### Step 2: Upload Your File

1. **Choose Import Method**:
   - Select "Excel File" for .xlsx/.xls files
   - Select "CSV File" for .csv files
   - Select "JSON File" for .json files

2. **Upload File**:
   - Click "Choose [FORMAT] File"
   - Select your prepared file
   - Wait for processing confirmation

### Step 3: Preview and Validate

1. **Review Preview**:
   - Check that all products are correctly parsed
   - Look for validation errors or warnings
   - Verify data formatting

2. **Fix Issues**:
   - Address any validation errors
   - Correct data formatting issues
   - Re-upload if necessary

### Step 4: Import Products

1. **Start Import**:
   - Click "Import Products" when ready
   - Monitor the progress bar
   - Wait for completion confirmation

2. **Verify Results**:
   - Check the import summary
   - Review newly added products in your catalog
   - Address any import errors

## File Format Examples

### Excel/CSV Format
```csv
name,brand,category,vehicleType,model,year,price,originalPrice,stockQuantity,description,images
"Kawasaki Brute Force 750 Air Filter","Kawasaki","Air Intake & Filters","ATV","Brute Force","2020-2024",45.99,59.99,25,"Premium air filter for improved performance","https://example.com/image1.jpg,https://example.com/image2.jpg"
"Polaris RZR XP 1000 Exhaust","Polaris","Exhaust Systems","UTV","RZR XP 1000","2016-2023",299.99,399.99,12,"High-flow exhaust system","https://example.com/image3.jpg"
```

### JSON Format
```json
[
  {
    "name": "Kawasaki Brute Force 750 Air Filter",
    "brand": "Kawasaki",
    "category": "Air Intake & Filters",
    "vehicleType": "ATV",
    "model": "Brute Force",
    "year": "2020-2024",
    "price": 45.99,
    "originalPrice": 59.99,
    "stockQuantity": 25,
    "description": "Premium air filter for improved performance",
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ]
  }
]
```

## Best Practices

### Data Preparation
1. **Use Consistent Formatting**:
   - Standardize brand names (e.g., "Kawasaki" not "KAWASAKI" or "kawasaki")
   - Use consistent category names
   - Format prices as numbers without currency symbols

2. **Image URLs**:
   - Use high-quality, publicly accessible image URLs
   - Ensure images are in common formats (JPG, PNG, WebP)
   - Separate multiple URLs with commas
   - Test URLs before importing

3. **Descriptions**:
   - Write clear, detailed product descriptions
   - Include key features and benefits
   - Use consistent terminology

### Validation Tips
1. **Check Required Fields**:
   - Ensure all required fields are filled
   - Verify data types (numbers for prices, text for names)

2. **Review Warnings**:
   - Address validation warnings
   - Fix formatting issues
   - Verify data accuracy

3. **Test Import**:
   - Start with a small test file
   - Verify results before importing large datasets
   - Keep backup of original data

## Troubleshooting

### Common Issues

1. **File Not Processing**:
   - Check file format compatibility
   - Ensure file is not corrupted
   - Verify file size (max 10MB recommended)

2. **Validation Errors**:
   - Missing required fields
   - Invalid data types
   - Malformed URLs

3. **Import Failures**:
   - Network connectivity issues
   - Firebase quota limits
   - Duplicate product detection

### Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Missing required fields" | Required fields empty | Fill in all required fields |
| "Invalid price format" | Price not a number | Use numeric values only |
| "File format not supported" | Wrong file type | Use supported formats |
| "Duplicate product detected" | Product already exists | Check existing catalog |

## Advanced Features

### Duplicate Detection
The system automatically detects and skips duplicate products based on:
- Product name
- Brand name
- Part number (if provided)

### Progress Tracking
- Real-time progress bar during import
- Detailed success/error reporting
- Import summary with statistics

### Data Validation
- Automatic field validation
- Data type checking
- Format verification
- Warning system for potential issues

## Support

If you encounter issues with the bulk import feature:

1. **Check this guide** for common solutions
2. **Review error messages** for specific issues
3. **Test with template file** to verify format
4. **Contact support** if problems persist

## Tips for Large Imports

1. **Break Down Large Files**:
   - Import in batches of 100-500 products
   - Test with small samples first
   - Monitor import progress

2. **Optimize File Size**:
   - Compress images before uploading
   - Use efficient image formats
   - Remove unnecessary data

3. **Schedule Imports**:
   - Import during off-peak hours
   - Allow time for processing
   - Monitor system resources

---

**Note**: The bulk import feature is designed to handle large datasets efficiently while maintaining data integrity and preventing duplicates. Always backup your existing data before performing large imports.
