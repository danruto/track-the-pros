import { type Component, type ComponentProps, Show } from "solid-js"
import { IconChevronDown, IconChevronUp } from "~/components/Icons"
import { TableHead } from "~/components/ui/table"
import { cn } from "~/lib/utils"

export const TableHeadWithSort: Component<
    ComponentProps<"th"> & {
        text: string
        class?: string
        onClick: () => void

        selected: boolean
        direction: "DESC" | "ASC"
    }
> = (props) => {
    return (
        <TableHead
            // TODO: Hover classes, cursor etc
            class={cn(props.class, "cursor-pointer", {
                "font-bold": props.selected,
            })}
            onClick={props.onClick}
        >
            <div class="flex items-center">
                {props.text}
                <Show when={props.selected && props.direction === "ASC"}>
                    <IconChevronUp class="ml-1" />
                </Show>
                <Show when={props.selected && props.direction === "DESC"}>
                    <IconChevronDown class="ml-1" />
                </Show>
            </div>
        </TableHead>
    )
}
