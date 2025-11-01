import {
  Category,
  Product,
  Inventory,
  Usage,
  Scan,
  Upload,
} from "@kisan-mitra/schemas";
import mongoose from "mongoose";

const userId = "6903f4d5c0f20cca8616b7fe";

const seedData = {
  categories: [
    {
      name: "Fertilizers",
      description: "Organic and chemical fertilizers for soil enrichment",
    },
    {
      name: "Pesticides",
      description: "Pest control and plant protection products",
    },
    { name: "Seeds", description: "Various crop seeds for planting" },
    { name: "Herbicides", description: "Weed control products" },
    { name: "Fungicides", description: "Fungal disease control products" },
    { name: "Insecticides", description: "Insect control products" },
    {
      name: "Growth Regulators",
      description: "Plant growth hormones and regulators",
    },
    {
      name: "Irrigation Supplies",
      description: "Water management and irrigation equipment",
    },
    {
      name: "Soil Amendments",
      description: "Products to improve soil quality",
    },
    { name: "Animal Feed", description: "Livestock and poultry feed" },
  ],
  products: {
    Fertilizers: [
      { name: "NPK 20-20-20", unit: "kg" },
      { name: "Urea", unit: "kg" },
      { name: "DAP (Diammonium Phosphate)", unit: "kg" },
      { name: "Potash", unit: "kg" },
      { name: "Organic Compost", unit: "kg" },
      { name: "Vermicompost", unit: "kg" },
      { name: "Bone Meal", unit: "kg" },
    ],
    Seeds: [
      { name: "Wheat Seeds - PBW 343", unit: "kg" },
      { name: "Rice Seeds - IR64", unit: "kg" },
      { name: "Maize Seeds - Hybrid", unit: "kg" },
      { name: "Cotton Seeds - Bt Cotton", unit: "kg" },
      { name: "Tomato Seeds - Hybrid", unit: "gram" },
      { name: "Cabbage Seeds", unit: "gram" },
      { name: "Soybean Seeds", unit: "kg" },
    ],
    Pesticides: [
      { name: "Neem Oil", unit: "liter" },
      { name: "Chlorpyrifos", unit: "liter" },
      { name: "Malathion", unit: "liter" },
    ],
    Herbicides: [
      { name: "Glyphosate", unit: "liter" },
      { name: "2,4-D", unit: "liter" },
    ],
  },
};

export async function seedDatabase() {
  try {
    console.log("Starting database seed...");

    // Clear existing data (optional - uncomment to clear)
    // await Category.deleteMany({});
    // await Product.deleteMany({});
    // await Inventory.deleteMany({ user: userId });
    // await Usage.deleteMany({ user: userId });

    await Scan.deleteMany({});

    // const categoryMap = new Map<string, mongoose.Types.ObjectId>();
    // const productMap = new Map<string, mongoose.Types.ObjectId>();

    // // Step 1: Insert categories
    // console.log("\n=== Creating Categories ===");
    // for (const categoryData of seedData.categories) {
    //   const category = await Category.create({
    //     ...categoryData,
    //     user: userId,
    //   });
    //   categoryMap.set(category.name, category._id as mongoose.Types.ObjectId);
    //   console.log(`✓ Created category: ${category.name}`);
    // }

    // // Step 2: Insert products
    // console.log("\n=== Creating Products ===");
    // for (const categoryData of seedData.categories) {
    //   const categoryId = categoryMap.get(categoryData.name);
    //   const productsForCategory =
    //     seedData.products[categoryData.name as keyof typeof seedData.products];

    //   if (productsForCategory && categoryId) {
    //     for (const productData of productsForCategory) {
    //       const product = await Product.create({
    //         ...productData,
    //         category: categoryId,
    //         user: userId,
    //       });
    //       productMap.set(product.name, product._id as mongoose.Types.ObjectId);
    //     }
    //     console.log(
    //       `✓ Added ${productsForCategory.length} products to ${categoryData.name}`
    //     );
    //   }
    // }

    // // Step 3: Create inventory items for the user
    // console.log("\n=== Creating Inventory Items ===");
    // const inventoryItems = [
    //   // Fertilizers
    //   {
    //     productName: "NPK 20-20-20",
    //     quantity: 150,
    //     batchNumber: "NPK-2024-001",
    //     location: "Warehouse A",
    //   },
    //   {
    //     productName: "Urea",
    //     quantity: 200,
    //     batchNumber: "UREA-2024-002",
    //     location: "Warehouse A",
    //   },
    //   {
    //     productName: "DAP (Diammonium Phosphate)",
    //     quantity: 100,
    //     batchNumber: "DAP-2024-001",
    //     location: "Warehouse A",
    //   },
    //   {
    //     productName: "Organic Compost",
    //     quantity: 500,
    //     location: "Storage Shed",
    //   },
    //   { productName: "Vermicompost", quantity: 80, location: "Storage Shed" },

    //   // Seeds
    //   {
    //     productName: "Wheat Seeds - PBW 343",
    //     quantity: 50,
    //     batchNumber: "WHEAT-2024-S1",
    //     expiryDate: new Date("2026-06-30"),
    //   },
    //   {
    //     productName: "Rice Seeds - IR64",
    //     quantity: 75,
    //     batchNumber: "RICE-2024-S1",
    //     expiryDate: new Date("2026-05-15"),
    //   },
    //   {
    //     productName: "Maize Seeds - Hybrid",
    //     quantity: 40,
    //     batchNumber: "MAIZE-2024-H1",
    //     expiryDate: new Date("2026-07-01"),
    //   },
    //   {
    //     productName: "Tomato Seeds - Hybrid",
    //     quantity: 500,
    //     batchNumber: "TOM-2024-H2",
    //     expiryDate: new Date("2025-12-31"),
    //   },
    //   {
    //     productName: "Soybean Seeds",
    //     quantity: 60,
    //     batchNumber: "SOY-2024-001",
    //     expiryDate: new Date("2026-04-30"),
    //   },

    //   // Pesticides
    //   {
    //     productName: "Neem Oil",
    //     quantity: 25,
    //     batchNumber: "NEEM-2024-001",
    //     location: "Chemical Storage",
    //     expiryDate: new Date("2026-10-31"),
    //   },
    //   {
    //     productName: "Chlorpyrifos",
    //     quantity: 15,
    //     batchNumber: "CHLOR-2024-002",
    //     location: "Chemical Storage",
    //     expiryDate: new Date("2025-12-31"),
    //   },

    //   // Herbicides
    //   {
    //     productName: "Glyphosate",
    //     quantity: 20,
    //     batchNumber: "GLYPH-2024-001",
    //     location: "Chemical Storage",
    //     expiryDate: new Date("2026-08-15"),
    //   },
    //   {
    //     productName: "2,4-D",
    //     quantity: 10,
    //     batchNumber: "24D-2024-001",
    //     location: "Chemical Storage",
    //     expiryDate: new Date("2026-03-31"),
    //   },

    //   // Irrigation Supplies
    //   {
    //     productName: "Drip Irrigation Pipes",
    //     quantity: 500,
    //     location: "Equipment Shed",
    //   },
    //   {
    //     productName: "Sprinkler Heads",
    //     quantity: 30,
    //     location: "Equipment Shed",
    //   },
    // ];

    // const inventoryMap = new Map<string, mongoose.Types.ObjectId>();

    // for (const invData of inventoryItems) {
    //   const productId = productMap.get(invData.productName);
    //   if (productId) {
    //     const inventory = await Inventory.create({
    //       product: productId,
    //       quantity: invData.quantity,
    //       batchNumber: invData.batchNumber,
    //       location: invData.location,
    //       expiryDate: invData.expiryDate,
    //       user: userId,
    //     });
    //     inventoryMap.set(
    //       invData.productName,
    //       inventory._id as mongoose.Types.ObjectId
    //     );
    //     console.log(
    //       `✓ Created inventory: ${invData.productName} - ${invData.quantity} units`
    //     );
    //   }
    // }

    // Step 4: Create usage history (past 12 months) for crop cycle analysis
    // console.log("\n=== Creating Usage History ===");

    // const today = new Date();
    // const usageData = [
    //   // January 2025 - Winter crop preparation
    //   {
    //     productName: "Urea",
    //     quantityUsed: 25,
    //     usedOn: new Date("2025-01-15"),
    //     crop: "Wheat",
    //     purpose: "Pre-sowing fertilization",
    //     field: "Field A",
    //   },
    //   {
    //     productName: "DAP (Diammonium Phosphate)",
    //     quantityUsed: 20,
    //     usedOn: new Date("2025-01-20"),
    //     crop: "Wheat",
    //     purpose: "Base fertilizer",
    //     field: "Field A",
    //   },

    //   // February 2025 - Sowing season
    //   {
    //     productName: "Wheat Seeds - PBW 343",
    //     quantityUsed: 30,
    //     usedOn: new Date("2025-02-05"),
    //     crop: "Wheat",
    //     purpose: "Sowing",
    //     field: "Field A",
    //   },
    //   {
    //     productName: "Neem Oil",
    //     quantityUsed: 2,
    //     usedOn: new Date("2025-02-20"),
    //     crop: "Wheat",
    //     purpose: "Pest prevention",
    //     field: "Field A",
    //   },

    //   // March 2025 - Spring crop management
    //   {
    //     productName: "NPK 20-20-20",
    //     quantityUsed: 15,
    //     usedOn: new Date("2025-03-10"),
    //     crop: "Wheat",
    //     purpose: "Top dressing",
    //     field: "Field A",
    //   },
    //   {
    //     productName: "Glyphosate",
    //     quantityUsed: 3,
    //     usedOn: new Date("2025-03-15"),
    //     crop: "Wheat",
    //     purpose: "Weed control",
    //     field: "Field A",
    //   },

    //   // April 2025 - Pre-monsoon preparation
    //   {
    //     productName: "Organic Compost",
    //     quantityUsed: 100,
    //     usedOn: new Date("2025-04-05"),
    //     crop: "Rice",
    //     purpose: "Soil preparation",
    //     field: "Field B",
    //   },
    //   {
    //     productName: "Vermicompost",
    //     quantityUsed: 20,
    //     usedOn: new Date("2025-04-10"),
    //     crop: "Tomato",
    //     purpose: "Bed preparation",
    //     field: "Field C",
    //   },

    //   // May 2025 - Summer crop sowing
    //   {
    //     productName: "Rice Seeds - IR64",
    //     quantityUsed: 40,
    //     usedOn: new Date("2025-05-20"),
    //     crop: "Rice",
    //     purpose: "Transplanting",
    //     field: "Field B",
    //   },
    //   {
    //     productName: "Tomato Seeds - Hybrid",
    //     quantityUsed: 100,
    //     usedOn: new Date("2025-05-10"),
    //     crop: "Tomato",
    //     purpose: "Nursery sowing",
    //     field: "Field C",
    //   },
    //   {
    //     productName: "Drip Irrigation Pipes",
    //     quantityUsed: 150,
    //     usedOn: new Date("2025-05-25"),
    //     crop: "Tomato",
    //     purpose: "Irrigation setup",
    //     field: "Field C",
    //   },

    //   // June 2025 - Monsoon crop care
    //   {
    //     productName: "Urea",
    //     quantityUsed: 30,
    //     usedOn: new Date("2025-06-10"),
    //     crop: "Rice",
    //     purpose: "First top dressing",
    //     field: "Field B",
    //   },
    //   {
    //     productName: "Chlorpyrifos",
    //     quantityUsed: 2,
    //     usedOn: new Date("2025-06-15"),
    //     crop: "Rice",
    //     purpose: "Stem borer control",
    //     field: "Field B",
    //   },

    //   // July 2025 - Mid-season management
    //   {
    //     productName: "NPK 20-20-20",
    //     quantityUsed: 20,
    //     usedOn: new Date("2025-07-05"),
    //     crop: "Rice",
    //     purpose: "Second top dressing",
    //     field: "Field B",
    //   },
    //   {
    //     productName: "Neem Oil",
    //     quantityUsed: 3,
    //     usedOn: new Date("2025-07-20"),
    //     crop: "Tomato",
    //     purpose: "Organic pest control",
    //     field: "Field C",
    //   },

    //   // August 2025 - Pre-harvest care
    //   {
    //     productName: "2,4-D",
    //     quantityUsed: 2,
    //     usedOn: new Date("2025-08-10"),
    //     crop: "Rice",
    //     purpose: "Weed control",
    //     field: "Field B",
    //   },
    //   {
    //     productName: "Sprinkler Heads",
    //     quantityUsed: 5,
    //     usedOn: new Date("2025-08-15"),
    //     crop: "Rice",
    //     purpose: "Irrigation maintenance",
    //     field: "Field B",
    //   },

    //   // September 2025 - Post-harvest and preparation
    //   {
    //     productName: "Organic Compost",
    //     quantityUsed: 150,
    //     usedOn: new Date("2025-09-25"),
    //     crop: "Maize",
    //     purpose: "Post-harvest soil enrichment",
    //     field: "Field A",
    //   },

    //   // October 2025 - Autumn sowing
    //   {
    //     productName: "Maize Seeds - Hybrid",
    //     quantityUsed: 20,
    //     usedOn: new Date("2025-10-05"),
    //     crop: "Maize",
    //     purpose: "Sowing",
    //     field: "Field A",
    //   },
    //   {
    //     productName: "DAP (Diammonium Phosphate)",
    //     quantityUsed: 25,
    //     usedOn: new Date("2025-10-10"),
    //     crop: "Maize",
    //     purpose: "Basal fertilizer",
    //     field: "Field A",
    //   },
    //   {
    //     productName: "Soybean Seeds",
    //     quantityUsed: 30,
    //     usedOn: new Date("2025-10-15"),
    //     crop: "Soybean",
    //     purpose: "Sowing",
    //     field: "Field D",
    //   },
    // ];

    // for (const usage of usageData) {
    //   const inventoryId = inventoryMap.get(usage.productName);
    //   if (inventoryId) {
    //     await Usage.create({
    //       inventory: inventoryId,
    //       quantityUsed: usage.quantityUsed,
    //       usedOn: usage.usedOn,
    //       crop: usage.crop,
    //       field: usage.field,
    //       purpose: usage.purpose,
    //       user: userId,
    //     });
    //     console.log(
    //       `✓ Created usage: ${usage.productName} - ${
    //         usage.quantityUsed
    //       } units for ${usage.crop} on ${usage.usedOn.toLocaleDateString()}`
    //     );
    //   }
    // }

    // // Step 5: Create scan data using recent uploads
    // console.log("\n=== Creating Scan Records ===");

    // Get the 5 most recent uploads for this user
    const recentUploads = await Upload.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .exec();

    if (recentUploads.length === 0) {
      console.log("⚠ No uploads found for user. Skipping scan creation.");
    } else {
      console.log(`Found ${recentUploads.length} recent uploads`);

      const scanData = [
        // Scan 1: Positive - Tomato Late Blight (communicable disease)
        {
          upload: recentUploads[0]._id,
          status: "completed",
          scannedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          affected: true,
          resolved: false,
          notifyNearbyFarmers: true,
          notificationRadiusKm: 10,
          results: [
            {
              defectType: "Tomato Late Blight",
              severity: "High",
              confidence: 0.92,
            },
            {
              defectType: "Tomato Early Blight",
              severity: "Low",
              confidence: 0.15,
            },
          ],
          aiInsights: {
            summary:
              "Late blight detected in tomato plant. This is a serious fungal disease that can spread rapidly, especially in humid conditions. Immediate action recommended.",
            recommendations: [
              "Remove and destroy infected plant parts immediately",
              "Apply copper-based fungicide (e.g., Bordeaux mixture) every 7-10 days",
              "Improve air circulation around plants by spacing them properly",
              "Avoid overhead watering; water at the base of plants in the morning",
              "Consider resistant varieties for future plantings",
              "Monitor neighboring plants closely for signs of infection",
            ],
          },
        },

        // Scan 2: Positive - Potato Early Blight
        {
          upload: recentUploads[1]._id,
          status: "completed",
          scannedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          affected: true,
          resolved: false,
          notifyNearbyFarmers: false,
          results: [
            {
              defectType: "Potato Early Blight",
              severity: "Medium",
              confidence: 0.87,
            },
          ],
          aiInsights: {
            summary:
              "Early blight detected on potato plant. This fungal disease typically affects older leaves first and can reduce yield if left untreated.",
            recommendations: [
              "Remove affected lower leaves to reduce disease spread",
              "Apply fungicides containing chlorothalonil or mancozeb",
              "Maintain proper plant spacing for good air circulation",
              "Use drip irrigation instead of overhead watering",
              "Apply mulch to prevent soil splash onto lower leaves",
              "Rotate crops - avoid planting potatoes or tomatoes in the same area for 2-3 years",
            ],
          },
        },

        // Scan 3: Positive - Pepper Bacterial Spot
        {
          upload: recentUploads[2]._id,
          status: "completed",
          scannedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          affected: true,
          resolved: true,
          resolvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // resolved 1 day ago
          notifyNearbyFarmers: false,
          results: [
            {
              defectType: "Pepper Bell Bacterial Spot",
              severity: "Medium",
              confidence: 0.78,
            },
          ],
          aiInsights: {
            summary:
              "Bacterial spot identified on pepper plant. This bacterial disease affects leaves, stems, and fruits. Good news - this has been marked as resolved!",
            recommendations: [
              "Use copper-based bactericides for treatment",
              "Remove and destroy severely infected plants",
              "Avoid working with plants when they are wet",
              "Use disease-free seeds and transplants",
              "Practice crop rotation with non-solanaceous crops",
              "Maintain proper plant spacing to improve air circulation",
            ],
          },
        },

        // Scan 4: Negative - Healthy Tomato
        {
          upload: recentUploads[3]
            ? recentUploads[3]._id
            : recentUploads[0]._id,
          status: "completed",
          scannedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
          affected: false,
          resolved: false,
          notifyNearbyFarmers: false,
          results: [
            {
              defectType: "Tomato Healthy",
              severity: "None",
              confidence: 0.95,
            },
          ],
          aiInsights: {
            summary:
              "Your tomato plant appears healthy with no visible signs of disease or defects. Keep up the good work!",
            recommendations: [
              "Continue regular monitoring for any changes",
              "Maintain consistent watering schedule",
              "Ensure adequate spacing between plants for air circulation",
              "Apply balanced fertilizer as needed for optimal growth",
              "Inspect regularly for early signs of pests or diseases",
              "Keep area around plants weed-free",
            ],
          },
        },

        // Scan 5: Negative - Healthy Potato
        {
          upload: recentUploads[4]
            ? recentUploads[4]._id
            : recentUploads[1]._id,
          status: "completed",
          scannedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
          affected: false,
          resolved: false,
          notifyNearbyFarmers: false,
          results: [
            {
              defectType: "Potato Healthy",
              severity: "None",
              confidence: 0.91,
            },
          ],
          aiInsights: {
            summary:
              "Excellent! Your potato plant is healthy and shows no signs of disease. Continue current care practices.",
            recommendations: [
              "Monitor soil moisture levels regularly",
              "Hill up soil around plants as they grow to protect tubers",
              "Watch for common pests like Colorado potato beetle",
              "Apply organic mulch to conserve moisture and suppress weeds",
              "Ensure plants receive 6-8 hours of sunlight daily",
              "Plan crop rotation for next season to prevent soil-borne diseases",
            ],
          },
        },
      ];

      for (let i = 0; i < scanData.length && i < recentUploads.length; i++) {
        const scan = await Scan.create({
          ...scanData[i],
          user: userId,
        });
        const defectType = scan.results[0]?.defectType || "Unknown";
        const isHealthy = scan.affected ? "Diseased" : "Healthy";
        console.log(
          `✓ Created scan: ${defectType} - ${isHealthy} (${
            scan.affected && !scan.resolved
              ? "Active"
              : scan.resolved
              ? "Resolved"
              : "Healthy"
          })`
        );
      }
    }

    console.log("\n=== Database Seeded Successfully! ===");
    console.log(`\nSummary:`);
    // console.log(`- Categories: ${seedData.categories.length}`);
    // console.log(`- Products: ${productMap.size}`);
    // console.log(`- Inventory Items: ${inventoryItems.length}`);
    // console.log(`- Usage Records: ${usageData.length}`);
    console.log(`- Scans: ${Math.min(recentUploads.length, 5)}`);
    console.log(`- User ID: ${userId}`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}
