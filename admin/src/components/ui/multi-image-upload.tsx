"use client";
import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';

interface MultiImageUploadProps {
    value?: (string | File)[];
    onChange: (files: (string | File)[]) => void;
    onRemove: (index: number) => void;
}

export function MultiImageUpload({ value = [], onChange, onRemove }: MultiImageUploadProps) {
    const [previews, setPreviews] = useState<string[]>([]);

    useEffect(() => {
        const newPreviews = value.map(file => {
            if (typeof file === 'string') {
                return getImageUrl(file);
            }
            return URL.createObjectURL(file);
        });
        setPreviews(newPreviews);

        return () => {
            newPreviews.forEach(url => {
                if (url.startsWith('blob:')) URL.revokeObjectURL(url);
            });
        };
    }, [value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            onChange([...value, ...newFiles]);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
                {previews.map((preview, index) => (
                    <div key={index} className="relative w-24 h-24 border rounded-md overflow-hidden">
                        <button
                            type="button"
                            onClick={() => onRemove(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                        >
                            <X className="h-3 w-3" />
                        </button>
                        <img
                            src={preview}
                            alt={`Preview ${index}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
                <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100">
                    <Upload className="w-6 h-6 text-slate-500" />
                    <span className="text-xs text-slate-500 mt-1">Add</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
            </div>
        </div>
    );
}
