import ErrorPageView from '@/page-sections/error/ErrorPageView';
export const metadata = {
  title: '404 - Not Found!'
};
export default function NotFound() {
  return <ErrorPageView />;
}