import { Button, Popover, PopoverContent, PopoverTrigger, User } from "@nextui-org/react";
import { HiOutlineChatBubbleOvalLeftEllipsis } from "react-icons/hi2";


export default function UserPopover({user, className, placement}: {user: any, className?: string, placement?: string}) {
  return (
    <Popover showArrow placement="bottom">
      <PopoverTrigger className={"cursor-pointer w-max inline pr-2 text-primary " + className}>
        {`@${user.name}`}
      </PopoverTrigger>
      <PopoverContent className="p-2 flex-row gap-2">
        <User
          name={user.name}
          description={user.role.name}
          avatarProps={{src: user.avatar}}
        />
        <Button isIconOnly variant="light">
          <HiOutlineChatBubbleOvalLeftEllipsis size={"1.5rem"} />
        </Button>
      </PopoverContent>
    </Popover>
  )
}