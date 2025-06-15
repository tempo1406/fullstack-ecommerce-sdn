import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
    try {
        console.log("🔧 Testing Cloudinary configuration...");

        const config = {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "Set" : "Missing",
            api_key: process.env.CLOUDINARY_API_KEY ? "Set" : "Missing",
            api_secret: process.env.CLOUDINARY_API_SECRET ? "Set" : "Missing",
        };

        return NextResponse.json({
            status: "Cloudinary configuration check",
            config,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Cloudinary configuration error", details: error },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("image") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No image file provided" },
                { status: 400 }
            );
        }

        // Check file type
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp",
        ];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                {
                    error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.",
                },
                { status: 400 }
            );
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "File size too large. Maximum size is 5MB." },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);        const uploadResult = await new Promise<{
            secure_url: string;
            public_id: string;
            width: number;
            height: number;
        }>((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        resource_type: "image",
                        folder: "products",
                        transformation: [
                            { width: 1000, height: 1000, crop: "limit" },
                            { quality: "auto" },
                            { fetch_format: "auto" },
                        ],
                    },
                    (error: unknown, result: unknown) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result as {
                                secure_url: string;
                                public_id: string;
                                width: number;
                                height: number;
                            });
                        }
                    }
                )
                .end(buffer);        });
        
        return NextResponse.json({
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
            width: uploadResult.width,
            height: uploadResult.height,
        });
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return NextResponse.json(
            { error: "Failed to upload image to Cloudinary" },
            { status: 500 }
        );
    }
}
