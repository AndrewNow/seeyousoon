export { renderers } from '../renderers.mjs';
export { onRequest } from '../_empty-middleware.mjs';

const page = () => import('./pages/generic_eed6e2cb.mjs').then(n => n.g);

export { page };
