import { cn } from "@/lib/utils";
import { NavLink } from "react-router";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  //const underline = "border-b-4 border-b-blue-900 border-t-4 border-t-transparent";
  const selectedTextStyle = "text-foreground border-b-4 border-secondary";
  const unSelectedTextStyle = "text-foreground/60";

  const links = [
    ["/", "Dashboard"],
    ["/brews", "Brews"],
    ["/receipts", "Receipts"],
    ["/stock-line", "Stock"],
    ["/sales", "Sales"],
  ];

  return (
    <nav
      className={cn(
        "flex items-center space-x-4 lg:space-x-6 items-start leading-7",
        className
      )}
      {...props}
    >
      {links.map((link, i) => (
        <NavLink
          className={({ isActive, isPending }) =>
            isActive
              ? selectedTextStyle
              : isPending
              ? "pending"
              : unSelectedTextStyle
          }
          to={link[0]}
          key={i}
        >
          {link[1]}
        </NavLink>
      ))}
    </nav>
  );
}
