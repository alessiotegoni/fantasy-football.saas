export default function PublicLayout({ children, auth }: LayoutProps<"/">) {
  return (
    <>
      {children}
      {auth}
    </>
  );
}
