import NextLink from 'next/link';

// ==============================================================

// ==============================================================

export default function Link({
  href,
  children,
  ...others
}) {
  return <NextLink href={href} {...others}>
      {children}
    </NextLink>;
}