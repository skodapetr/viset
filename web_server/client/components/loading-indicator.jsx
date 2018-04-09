import React from "react";

export const LoadingIndicator = ({message}) => (
    <div style={{"textAlign": "center"}}>
        {message === undefined ? "Loading ..." : message}
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
