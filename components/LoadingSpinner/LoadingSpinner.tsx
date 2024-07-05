import classNames from "classnames";

interface CircleRailProps {
    className?: string;
    size?: 'tiny' | 'xs' | 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner(props: CircleRailProps) {
    return (
        <div
            className={classNames(
                'loadingSpinner',
                props.className ?? '',
                props.size ? props.size : 'sm',
            )}
            role="alert"
            aria-busy="true"
            aria-live="polite"
        ></div>
    );
}