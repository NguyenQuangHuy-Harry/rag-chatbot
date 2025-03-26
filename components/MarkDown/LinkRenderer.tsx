// Custom link renderer to intercept product links
export const LinkRenderer = ({ href, children }: any) => {
  return (
    <a href={href} style={{ color: "blue" }}>
      {children}
    </a>
  );
};
