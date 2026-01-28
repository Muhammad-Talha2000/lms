import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

export function DropMenu({ triggerLabel, items }) {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>{triggerLabel}</MenubarTrigger>
        <MenubarContent>
          {items.map((item, index) => (
            <MenubarItem key={index} onClick={item.onClick}>
              {item.label}
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
