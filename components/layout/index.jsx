import Header from "./layoutcomponents/Header";



export default function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}