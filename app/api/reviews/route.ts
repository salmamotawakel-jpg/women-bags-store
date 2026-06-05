// app/api/reviews/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";

// GET: جلب مراجعات منتج معين
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      apiVersion: "2024-01-01",
      useCdn: false,
    });

    const query = `*[_type == "review" && product._ref == $productId && approved == true] | order(createdAt desc){
      _id,
      userName,
      rating,
      title,
      comment,
      helpful,
      createdAt,
      "userImage": userImage.asset->url,
      "images": images[]{
        asset->{
          _id,
          url
        }
      }
    }`;

    const reviews = await client.fetch(query, { productId });
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST: إضافة مراجعة جديدة (مع أو بدون صور)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const productId = formData.get("productId") as string;
    const userName = formData.get("userName") as string;
    const rating = parseInt(formData.get("rating") as string);
    const title = formData.get("title") as string;
    const comment = formData.get("comment") as string;
    const userImageFile = formData.get("userImage") as File | null;
    const images = formData.getAll("images") as File[];

    if (!productId || !userName || !rating || !title || !comment) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      apiVersion: "2024-01-01",
      useCdn: false,
      token: process.env.SANITY_API_WRITE_TOKEN,
    });

    // رفع صورة المستخدم (Avatar)
    let userImageAsset = null;
    if (userImageFile && userImageFile.size > 0) {
      const buffer = Buffer.from(await userImageFile.arrayBuffer());
      const asset = await client.assets.upload("image", buffer, {
        filename: `avatar-${Date.now()}.${userImageFile.name.split('.').pop()}`,
        contentType: userImageFile.type,
      });
      userImageAsset = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: asset._id,
        },
      };
    }

    // رفع صور المراجعة
    const imageAssets = [];
    for (const image of images) {
      if (image.size > 0) {
        const buffer = Buffer.from(await image.arrayBuffer());
        const asset = await client.assets.upload("image", buffer, {
          filename: image.name,
          contentType: image.type,
        });
        imageAssets.push({
          _type: "image",
          asset: {
            _type: "reference",
            _ref: asset._id,
          },
        });
      }
    }

    const review = {
      _type: "review",
      product: {
        _type: "reference",
        _ref: productId,
      },
      userName,
      userImage: userImageAsset,
      rating,
      title,
      comment,
      images: imageAssets,
      createdAt: new Date().toISOString(),
      approved: true,
      helpful: 0,
    };

    const result = await client.create(review);
    return NextResponse.json({ success: true, review: result });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}

// PUT: إضافة لايك لمراجعة
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { reviewId, helpful } = body;

    if (!reviewId) {
      return NextResponse.json({ error: "Review ID required" }, { status: 400 });
    }

    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      apiVersion: "2024-01-01",
      useCdn: false,
      token: process.env.SANITY_API_WRITE_TOKEN,
    });

    const result = await client
      .patch(reviewId)
      .set({ helpful: (helpful || 0) + 1 })
      .commit();

    return NextResponse.json({ success: true, review: result });
  } catch (error) {
    console.error("Error liking review:", error);
    return NextResponse.json({ error: "Failed to like review" }, { status: 500 });
  }
}