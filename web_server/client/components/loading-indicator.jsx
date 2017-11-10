import React from "react";

export const LoadingIndicator = () => (
    <div>
        Loading ...
    </div>
);

export function addLoadingIndicator(WrappedComponent) {
    // TODO Can we extract this as standalone function/class ?
    return (props) => {
        if (props.isLoading) {
            return (
                <LoadingIndicator/>
            );
        } else {
            return (
                <WrappedComponent {...props}/>
            )
        }
    };
}

// TODO Update to use fetchData property to request data fetch and then wait till the "data' are available.
