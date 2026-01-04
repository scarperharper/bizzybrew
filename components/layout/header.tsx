import BizzybrewLogo from "../local/bizzybrew-logo";
import { MainNav } from "../local/main-nav";
import { Search } from "../local/search";
import { ModeToggle } from "../mode-toggle";

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="max-w-32 mr-2">
          <BizzybrewLogo className="fill-secondary" />
        </div>

        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          {/* <UserNav /> */}
          {/* <div className="w-8 h-8 mr-2">
					<BizzybrewBubble className="fill-secondary" />
					</div> */}
        </div>
      </div>
    </div>
  );
}
