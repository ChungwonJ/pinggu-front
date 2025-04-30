import Header from "./layoutcomponents/Header";



export default function Layout({ children, toggleTheme }) {
  return (
    <>
      <Header toggleTheme={toggleTheme} />
      {children}
    </>
  );
}