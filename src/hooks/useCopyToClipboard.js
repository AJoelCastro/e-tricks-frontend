import { useState, useCallback } from 'react';
export default function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState(null);
  const handleCopy = useCallback(async text => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
    } catch (error) {
      console.log(error);
      setCopiedText(null);
    }
  }, [setCopiedText]);
  return {
    handleCopy,
    copiedText
  };
}