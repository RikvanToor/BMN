import React from 'react';

 let SvgContext = React.createContext();
 export default SvgContext;

export function withContext(contextType, component){
    return (props)=>{
        let Consumer = contextType.Consumer;
        let Comp = component;
        let {children, ...rest} = props; 
        return (
            <Consumer>
            {(context)=>{
                    return (
                        <Comp context={context} {...rest}>{children}</Comp>
                    );
                }
            }
            </Consumer>
        );
    };
}
export function withSvgContext(component){
    return withContext(SvgContext, component);
}