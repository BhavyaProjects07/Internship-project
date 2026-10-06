"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";

export default function HomeHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();

  console.log("CLERK FRONTEND:", {
    isLoaded,
    isSignedIn,
    userId: user?.id,
  });

  // Close profile sidebar with Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    };

    if (profileOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [profileOpen]);

  // Prevent background scrolling while profile sidebar is open
  useEffect(() => {
    if (profileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [profileOpen]);

  const handleLogout = async () => {
    setProfileOpen(false);
    setMobileMenuOpen(false);

    await signOut({
      redirectUrl: "/",
    });
  };

  const displayName =
    user?.fullName ||
    user?.firstName ||
    user?.username ||
    "User";

  const email = user?.primaryEmailAddress?.emailAddress || "";

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/90 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-8">
            <Link href="/" className="group flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/20 transition-transform duration-200 group-hover:scale-105">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.49L5.347 11.23a7.842 7.842 0 011.666-.184c.85 0 1.25.13 1.25.13l2.84 8.283c.307.094.63.141.96.141.252 0 .497-.03.738-.088l2.91-8.336s.44.053 1.13.053c.123 0 .256-.002.396-.007L13.82 21.05C18.17 19.82 22 16.14 22 12c0-5.523-4.477-10-10-10zm-1.89 2.11c.6.01 1.22.08 1.82.23l2.58 7.42c-.44-.02-.8-.03-1.07-.03-.86 0-1.28.13-1.28.13L10.11 4.11zm-4.32 1.62c1.23-.96 2.76-1.57 4.42-1.7l3.87 11.33-4.22-12.35c-.41-.03-.78-.05-1.07-.05-.86 0-1.28.13-1.28.13L6.15 6.09l-.36-.36zM3.97 12c0-1.63.45-3.15 1.24-4.47l4.7 12.92C6.27 19.06 3.97 15.8 3.97 12z" />
                </svg>
              </div>

              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-neutral-950">
                  SiteBuilder
                </span>

                <span className="-mt-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-blue-600">
                  Studio Edition
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-7 text-sm font-medium text-neutral-600 md:flex">
              <Link
                href="/templates"
                className="transition-colors hover:text-blue-600"
              >
                Templates
              </Link>

              <a
                href="#features"
                className="transition-colors hover:text-blue-600"
              >
                Features
              </a>

              <a
                href="#editor"
                className="transition-colors hover:text-blue-600"
              >
                Gutenberg Engine
              </a>

              <a
                href="#community"
                className="transition-colors hover:text-blue-600"
              >
                Resources
              </a>
            </nav>
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 sm:flex">
            {isLoaded && (
              <>
                {isSignedIn ? (
                  <div className="flex items-center gap-2">
                    {/* Start Building */}
                    <Link
                      href="/templates"
                      className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4.5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm shadow-blue-600/20 transition-all duration-200 hover:bg-blue-500 hover:shadow-md hover:shadow-blue-500/25 active:scale-[0.99]"
                    >
                      <span>Start Building</span>
                      <span className="ml-1.5">→</span>
                    </Link>

                    {/* Profile Button */}
                    <button
                      type="button"
                      onClick={() => setProfileOpen(true)}
                      className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-neutral-700 shadow-sm transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                      {/* Avatar */}
                      {user?.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt={displayName}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-600">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <span>Profile</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4.5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm shadow-blue-600/20 transition-all duration-200 hover:bg-blue-500 hover:shadow-md hover:shadow-blue-500/25 active:scale-[0.99]"
                  >
                    <span>Sign Up</span>
                    <span className="ml-1.5">→</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            {isLoaded && isSignedIn && (
              <button
                type="button"
                onClick={() => setProfileOpen(true)}
                aria-label="Open profile"
                className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-white shadow-sm transition hover:border-blue-200"
              >
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-bold text-blue-600">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                )}
              </button>
            )}

            {isLoaded && (
              <Link
                href={isSignedIn ? "/templates" : "/sign-up"}
                className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white"
              >
                {isSignedIn ? "Start" : "Sign Up"}
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
            >
              {mobileMenuOpen ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="animate-in slide-in-from-top-2 border-t border-neutral-200/80 bg-white px-6 py-4 fade-in md:hidden">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/templates"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-sm font-semibold text-neutral-900"
              >
                Templates Directory
              </Link>

              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-sm font-medium text-neutral-600"
              >
                Features & Tools
              </a>

              <a
                href="#editor"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-sm font-medium text-neutral-600"
              >
                Gutenberg Engine
              </a>

              <a
                href="#showcase"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-sm font-medium text-neutral-600"
              >
                Showcase
              </a>

              <Link
                href={isSignedIn ? "/templates" : "/sign-up"}
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 w-full rounded-xl bg-blue-600 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-white shadow-sm"
              >
                {isSignedIn ? "Get Started" : "Sign Up Free"}
              </Link>

              {isSignedIn && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setProfileOpen(true);
                  }}
                  className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-neutral-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  Open Profile
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* ========================================================= */}
      {/* PROFILE SIDEBAR */}
      {/* ========================================================= */}

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ${
          profileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setProfileOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-[min(380px,90vw)] flex-col border-l border-neutral-200 bg-white shadow-2xl transition-transform duration-300 ease-out ${
          profileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Profile sidebar"
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              Account
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-neutral-950">
              Your Profile
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setProfileOpen(false)}
            aria-label="Close profile"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 6l12 12M18 6L6 18"
              />
            </svg>
          </button>
        </div>

        {/* User Information */}
        <div className="border-b border-neutral-200 px-6 py-6">
          <div className="flex items-center gap-4">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={displayName}
                className="h-14 w-14 rounded-2xl object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-xl font-bold text-blue-600">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-neutral-950">
                {displayName}
              </h3>

              {email && (
                <p className="mt-1 truncate text-xs text-neutral-500">
                  {email}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 px-4 py-5">
          <p className="px-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
            Workspace
          </p>

          <div className="mt-2 space-y-1">
            {/* Your Websites */}
            <Link
              href="/websites"
              onClick={() => setProfileOpen(false)}
              className="group flex items-center gap-4 rounded-xl px-3 py-3.5 transition-colors hover:bg-blue-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600 transition-colors group-hover:bg-blue-100 group-hover:text-blue-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M3 4.5A1.5 1.5 0 014.5 3h15A1.5 1.5 0 0121 4.5v15a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 19.5v-15z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeWidth="1.8"
                    d="M7 8h10M7 12h10M7 16h6"
                  />
                </svg>
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-neutral-900">
                  Your Websites
                </p>

                <p className="mt-0.5 text-xs text-neutral-500">
                  View your saved drafts
                </p>
              </div>

              <svg
                className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-neutral-200 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-red-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 transition-colors group-hover:bg-red-100">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M15 3h4.5A1.5 1.5 0 0121 4.5v15a1.5 1.5 0 01-1.5 1.5H15"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M10 8l-4 4 4 4M6 12h10"
                />
              </svg>
            </div>

            <div>
              <p className="text-sm font-semibold text-neutral-900">
                Logout
              </p>

              <p className="text-xs text-neutral-500">
                Sign out of your account
              </p>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}