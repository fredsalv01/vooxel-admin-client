export const isSlot = (name, child) => {
    return child.type === Slot && Object.hasOwn(child, 'props') && Object.hasOwn(child.props, 'slot') && child.props.slot == name;
}

const Slot = ({ children }) => {
    return (
        <>
            {children}
        </>
    )
}
export default Slot;

