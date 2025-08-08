import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from 'firebase-admin/storage';
import { dbAdmin } from '@/lib/firebase/admin';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!dbAdmin) return NextResponse.json({ error: 'Admin not ready' }, { status: 500 });
  const contentType = req.headers.get('content-type') || '';
  if (!contentType.startsWith('multipart/form-data')) {
    return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 });
  }
  const formData = await req.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const bytes = Buffer.from(arrayBuffer);
  const filename = `images/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g,'_')}`;
  const bucket = getStorage().bucket();
  const fileRef = bucket.file(filename);
  await fileRef.save(bytes, { contentType: file.type, resumable: false, public: true });
  await fileRef.makePublic();
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
  return NextResponse.json({ url: publicUrl, path: filename });
}
