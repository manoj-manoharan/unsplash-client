import PropTypes from "prop-types"
import React, { useCallback, useEffect, useMemo, useState } from "react"

const DEFAULT_COLUMNS_COUNT = 1

const useWindowWidth = () => {

    const [width, setWidth] = useState(0);

    const handleResize = () => {
        setWidth(window.innerWidth)
    }

    useEffect(() => {
        
        window.addEventListener("resize", handleResize)
        handleResize()
        return () => window.removeEventListener("resize", handleResize)

    }, [handleResize])

    return width
}

const MasonryResponsive = ({
    columnsCountBreakPoints,
    children,
    className,
    style,
}) => {
    const windowWidth = useWindowWidth()
    const columnsCount = useMemo(() => {
        console.log({windowWidth});
        const breakPoints = Object.keys(columnsCountBreakPoints).sort(
            (a, b) => a - b
        )
        let count =
            breakPoints.length > 0
                ? columnsCountBreakPoints[breakPoints[0]]
                : DEFAULT_COLUMNS_COUNT

        breakPoints.forEach((breakPoint) => {
            if (breakPoint < windowWidth) {
                count = columnsCountBreakPoints[breakPoint]
            }
        })

        return count
    }, [windowWidth, columnsCountBreakPoints])

    return (
        <div className={className} style={style}>
            {React.Children.map(children, (child, index) =>
                React.cloneElement(child, {
                    key: index,
                    columnsCount: columnsCount,
                })
            )}
        </div>
    )
}

MasonryResponsive.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]).isRequired,
    columnsCountBreakPoints: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object,
}

MasonryResponsive.defaultProps = {
    columnsCountBreakPoints: {
        350: 1,
        600: 2,
        750: 3,
        900: 4,
    },
    className: null,
    style: null,
}

export default MasonryResponsive
