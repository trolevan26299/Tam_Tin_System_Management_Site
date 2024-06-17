// routes
import { paths } from 'src/routes/paths';

export const HOST_API = process.env.NEXT_PUBLIC_HOST_API;
export const HOST_API2 = process.env.NEXT_PUBLIC_HOST_API2;
export const ASSETS_API = process.env.NEXT_PUBLIC_ASSETS_API;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.dashboard.root; // as '/dashboard'
