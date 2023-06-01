import React from "react";
import classNames from "classnames";
import NextLink from "@/components/NextLink";

const buttonThemes = {
    materialGreyOutline: 'bg-white hover:bg-gray-100 text-gray-600 font-bold py-2 px-4 rounded border border-gray-600 shadow-sm hover:shadow-sm',
    greySimple: 'bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded border-2 border-transparent',
    greyPill: 'bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-full border-2 border-transparent',
    greenSimple: 'bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded border-2 border-transparent',
    greenPill: 'bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-full border-2 border-transparent',
    redSimple: 'bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded border-2 border-transparent',
    redPill: 'bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-full border-2 border-transparent',
    blueSimple: 'bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded border-2 border-transparent',
    bluePill: 'bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full border-2 border-transparent',
    blueOutline: 'bg-transparent hover:bg-blue-700 text-primary-blue-700 font-semibold hover:text-white py-2 px-4 border-2 border-primary-blue-800 hover:border-transparent rounded',
    blueBordered: 'bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 border border-blue-700 rounded border-2 border-transparent',
    blueDisabled: 'bg-blue-700 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed pointer-events-none border-2 border-transparent',
    blue3d: 'bg-blue-700 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-primary-blue-800 hover:border-primary-blue-700 rounded border-2 border-transparent',
    blueIcon: 'bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded border-2 border-transparent',
    chip: 'px-4 py-1.5 rounded-full text-gray-500 bg-gray-200 font-semibold text-sm flex align-center justify-between flex-row-reverse w-max cursor-pointer active:bg-gray-300 transition duration-300 ease border-2 border-transparent',
} as const;

type ButtonTheme = keyof typeof buttonThemes;

type ButtonType = 'button' | 'submit' | 'reset' | undefined;

interface ButtonProps {
    label: string;
    theme?: ButtonTheme;
    type?: ButtonType;
    svg?: JSX.Element;
    svgOnly?: boolean;
    reverseSvg?: boolean;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    href?: string;
    id?: string;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = (props) => {
    const { label, theme, type, svg, svgOnly, className, onClick, href, id, reverseSvg, disabled, ...rest } = props;

    const buttonClassNames = classNames(
        `flex items-center justify-center text-sm whitespace-nowrap ${reverseSvg ? "flex-row-reverse" : "flex-row"}`,
        `${buttonThemes[theme ?? 'blueSimple']}`,
        `${className ?? ""}`,
        `${disabled ? "opacity-50 !cursor-not-allowed !pointer-events-none" : ""}`,
    );

    const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick && !disabled) {
            return onClick(e);
        }
    }

    const RenderButtonContent = (): JSX.Element => (
        <>
            {svg ? (
                <>
                    <div className="relative flex items-center justify-center">{svg}</div>
                    {!props.svgOnly ? <span>{label}</span> : null}
                </>
            ) : (
                <>{label}</>
            )}
        </>
    );

    return (
        <>
        {href ?
            <NextLink
                href={href}
                className={buttonClassNames}
                { ...rest }
            >
                <RenderButtonContent />
            </NextLink>
        :
            <button
                id={id}
                className={buttonClassNames}
                onClick={handleOnClick}
                type={type ?? "button"}
                { ...rest }
            >
                <RenderButtonContent />
            </button>
        }
        </>
    );
};

export default Button;
