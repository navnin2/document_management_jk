import { SetMetadata } from '@nestjs/common';

/**
 * decorater of the set the api a public api.
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);