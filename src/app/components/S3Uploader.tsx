"use client"
import { useState } from "react";
import { S3 } from "aws-sdk";
import { ChangeEventHandler, MouseEventHandler } from "react";
import { useMotionValue, motion, useSpring, MotionValue } from "framer-motion";

const s3 = new S3({
  accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_S3_REGION,
});

export default function S3Uploader() {
  const [file, setFile] = useState<File | null>(null);
  const [upload, setUpload] = useState<S3.ManagedUpload | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null); // 추가된 부분
  const progress = useMotionValue(0);

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    setFile(e.target.files![0]);
  };

  const handleUpload: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    if (!file) return;
    const params = {
      Bucket: "nudge.wooriya.sign", // 버킷 이름으로 수정
      Key: file.name,
      Body: file,
    };

    try {
      const upload = s3.upload(params);
      setUpload(upload);
      upload.on("httpUploadProgress", (p) => {
        console.log(p.loaded / p.total);
        progress.set(p.loaded / p.total);
      });
      const result = await upload.promise(); // 업로드 결과 반환
      console.log(`File uploaded successfully: ${file.name}`);

      // 업로드된 이미지의 URL 생성
      const imageUrl = s3.getSignedUrl("getObject", {
        Bucket: params.Bucket,
        Key: params.Key,
      });

      setUploadedImageUrl(imageUrl); // 업로드된 이미지의 URL 저장
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (!upload) return;
    upload.abort();
    progress.set(0);
    setUpload(null);
  };

  return (
    <div className="dark flex min-h-screen w-full items-center justify-center">
      <main>
        <form className="flex flex-col gap-4 rounded bg-stone-800 p-10 text-white shadow">
          <input type="file" onChange={handleFileChange} />
          <button
            className="rounded bg-green-500 p-2 shadow"
            onClick={handleUpload}
          >
            Upload
          </button>
          {uploadedImageUrl && (
            <div>
              <p>Uploaded Image URL:</p>
              <a href={uploadedImageUrl} target="_blank" rel="noopener noreferrer">
                {uploadedImageUrl}
              </a>
            </div>
          )}
          {upload && (
            <>
              <button
                className="rounded bg-red-500 p-2 shadow"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </>
          )}
        </form>
      </main>
    </div>
  );
}
