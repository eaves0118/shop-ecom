import { HeaderClient } from "./header-client";
import { HeaderTop } from "./header-top";
export function Header() {
  return (
    <>
      <HeaderTop />
      <div className="page-container">
        <HeaderClient />
      </div>
    </>
  );
}
