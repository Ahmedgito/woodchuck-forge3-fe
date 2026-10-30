# CMS Admin Monthly Breakdown Fix

## Overview

This document describes the changes made to fix the monthly breakdown (accordion with MAY 2024, JUNE 2024, etc.) not showing for CMS admin users on the dashboard.

## Problem

CMS admin users were not seeing the monthly breakdown component on the dashboard, while other user roles (Admin, General Contractor, Manufacturer, etc.) could see it.

## Solution

### 1. WasteStreamStats Index (`index.tsx`)

**File:** `src/components/dashboard/dashboardStats/components/waste-stream-stats/index.tsx`

**Change:** Included `ROLES.CMS` in the roles that use `ClientWasteStreamStats`, so CMS users now see the monthly breakdown.

```tsx
{(user?.role.enum === ROLES.GENERAL_CONTRACTOR ||
  user?.role.enum === ROLES.MANUFACTURER ||
  user?.role.enum === ROLES.CMS) && (
  <ClientWasteStreamStats {...props} />
)}
```

### 2. ClientWasteStreamStats (`clientWasteStreamStats.tsx`)

**File:** `src/components/dashboard/dashboardStats/components/waste-stream-stats/clientWasteStreamStats.tsx`

**Problem:** CMS users may not have job sites from `getClientJobSites()` because they do not have access to the client and job site listing.

**Change:** Updated the fetch logic to:

1. **Call both APIs together** – `getFirstJobSite()` and `getClientJobSites()` are now called in parallel via `Promise.all()`.

2. **Fallback when no job sites** – If `getClientJobSites()` returns no job sites but `getFirstJobSite()` returns one, use that job site for the monthly breakdown.

3. **Fallback on error** – If `getClientJobSites()` fails, fall back to the first job site from `getFirstJobSite()`.

## Result

With these changes, CMS users see the monthly accordion (MAY 2024, JUNE 2024, JULY 2024, etc.) even when they only have access to the first job site. The monthly breakdown displays correctly for all supported user roles.
