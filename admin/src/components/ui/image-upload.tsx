"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Upload } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
    value?: string | File | null;
    onChange: (file: File | null) => void;
    onRemove: () => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (typeof value === 'string') {
            // If relative path from database (starts with /uploads), prepend generic host or handle transparently if proxy setup? 
            // Current setup: API at localhost:3000, App at localhost:3001?
            // Next.js Image component needs absolute URL or configured loader.
            // For simplicity in admin, standard img tag with full URL is easier.
            // API Base URL is http://localhost:3000/api. Uploads are at http://localhost:3000/uploads
            if (value.startsWith('/')) {
                setPreview(`http://localhost:3000${value}`);
            } else {
                setPreview(value);
            }
        } else if (value instanceof File) {
            const objectUrl = URL.createObjectURL(value);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreview(null);
        }
    }, [value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onChange(e.target.files[0]);
        }
    };

    if (preview) {
        return (
            <div className="relative w-40 h-40 border rounded-md overflow-hidden">
                <button
                    type="button"
                    onClick={() => {
                        onRemove();
                        setPreview(null);
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                >
                    <X className="h-4 w-4" />
                </button>
                <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                />
            </div>
        );
    }

    return (
        <div className="w-full max-w-sm items-center gap-1.5">
            <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-slate-500" />
                        <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span></p>
                    </div>
                    <input id="dropzone-file" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
            </div>
        </div>
    );
}
