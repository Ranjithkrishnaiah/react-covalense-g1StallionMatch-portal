import { sub } from 'date-fns';
//
 

// ----------------------------------------------------------------------

const _mock = {
  image: {
    cover: (index: number) =>
      `https://minimal-assets-api.vercel.app/assets/images/covers/cover_${index + 1}.jpg`,
    feed: (index: number) =>
      `https://minimal-assets-api.vercel.app/assets/images/feeds/feed_${index + 1}.jpg`,
    product: (index: number) =>
      `https://minimal-assets-api.vercel.app/assets/images/products/product_${index + 1}.jpg`,
    avatar: (index: number) =>
      `https://minimal-assets-api.vercel.app/assets/images/avatars/avatar_${index + 1}.jpg`,
  },
};

export default _mock;
