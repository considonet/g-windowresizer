declare module "@considonet/g-windowresizer" {

    interface IOnResizeCallback {
        (w: number, h: number): void
    }

    interface IOnBreakpointChangeCallback {
        (w: number, h: number, breakpoint: string): void
    }

    interface IOnOrientationChangeCallback {
        (w: number, h: number, orientation: string): void
    }

    interface IBreakpointMap {
        [breakpoint: number]: string
    }

    export function onResize(callback: IOnResizeCallback): void;
    export function onBreakpointChange(callback: IOnBreakpointChangeCallback): void;
    export function onOrientationChange(callback: IOnOrientationChangeCallback): void;
    export function overrideBreakpoints(breakpoints: IBreakpointMap): void;

}