"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

export default function MediaLibrary({ onSelect, onClose }) {
  const { getToken } = useAuth();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For Phase 5C, we can only add by URL
  const [newUrl, setNewUrl] = useState("");
  const [adding, setAdding] = useState(false);

  // For Phase 5D, file upload
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const fetchAssets = React.useCallback(async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/media`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setAssets(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to load media assets");
    } finally {
      setLoading(false);
    }
  }, [getToken, API_URL]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleAddUrl = async (e) => {
    e.preventDefault();
    if (!newUrl) return;
    setAdding(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/media`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url: newUrl, filename: newUrl.split("/").pop() || "Image" }),
      });
      const data = await res.json();
      if (data.success) {
        setAssets([data.data, ...assets]);
        setNewUrl("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/media/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setAssets(assets.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File must be smaller than 10MB");
      return;
    }

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setError("Only JPEG, PNG, WebP, and GIF images are allowed");
      return;
    }

    setUploading(true);
    setError(null);
    
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_URL}/media/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      
      const data = await res.json();
      if (data.success) {
        setAssets([data.data, ...assets]);
      } else {
        setError(data.message || "Failed to upload image");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden max-h-[85vh]">
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-900">Media Library</h2>
          <button onClick={onClose} className="p-1 rounded-md text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-5 border-b border-neutral-100 bg-neutral-50/50 flex flex-col sm:flex-row gap-3">
          {/* Upload Button */}
          <div className="flex-none">
            <input 
              type="file" 
              accept="image/jpeg, image/png, image/webp, image/gif" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full sm:w-auto bg-neutral-900 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-neutral-800 disabled:opacity-50 shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
          </div>

          <div className="hidden sm:flex items-center text-neutral-300 px-2">or</div>

          {/* URL Input */}
          <div className="flex flex-1 gap-2">
            <input 
              type="text" 
              placeholder="Add image via URL..." 
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-blue-500 shadow-sm"
            />
            <button 
              onClick={handleAddUrl}
              disabled={adding || !newUrl.trim()}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 shadow-sm transition-colors whitespace-nowrap"
            >
              {adding ? "Adding..." : "Add URL"}
            </button>
          </div>
        </div>

        <div className="p-5 overflow-y-auto flex-1 bg-white">
          {loading ? (
            <div className="text-center text-neutral-500 py-12 flex flex-col items-center">
              <span className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></span>
              Loading library...
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-10 bg-red-50 rounded-xl">{error}</div>
          ) : assets.length === 0 ? (
            <div className="text-center text-neutral-400 py-16 flex flex-col items-center border-2 border-dashed border-neutral-200 rounded-xl">
              <svg className="w-10 h-10 mb-3 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              No media assets found.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {assets.map((asset) => (
                <div 
                  key={asset.id} 
                  onClick={() => onSelect(asset.url)}
                  className="group relative border border-neutral-200 rounded-xl overflow-hidden cursor-pointer hover:border-blue-500 hover:shadow-md transition-all bg-neutral-50"
                >
                  <div className="aspect-square relative overflow-hidden flex items-center justify-center p-2">
                    <img 
                      src={asset.url} 
                      alt={asset.alt || asset.filename} 
                      className="max-w-full max-h-full object-contain rounded-md drop-shadow-sm" 
                    />
                    <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                      <span className="text-white text-xs font-bold bg-blue-600 px-4 py-2 rounded-full shadow-lg transform scale-95 group-hover:scale-100 transition-transform">Use Image</span>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, asset.id)}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-md hover:bg-red-50 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10"
                      title="Delete asset"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                  <div className="p-2.5 border-t border-neutral-100 bg-white truncate text-[10px] text-neutral-500 font-mono tracking-tight">
                    {asset.filename}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
