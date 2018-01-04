import React from "react";

export const LoadingIndicator = () => (
    <div style={{"textAlign": "center"}}>
        Loading ...
    </div>
);

// TODO Create new function that would understand how to work with repository entity.

export function addLoadingIndicator(WrappedComponent) {
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
