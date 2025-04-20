import Header from "./layoutComponents/Header";



export default function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}