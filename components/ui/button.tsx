import { cva, type VariantProps } from 'class-variance-authority'
import cn from 'classnames'
import * as React from 'react'

const buttonVariants = cva(
	'inline-flex items-center justify-center whitespace-nowrapfont-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none',
	{
		variants: {
			variant: {
				default:
					'bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-slate-500 dark:hover:bg-slate-400 rounded-sm ',
				destructive:
					'bg-destructive text-destructive-foreground hover:bg-destructive/90',
				outline:
					'border border-input bg-background hover:bg-accent hover:text-accent-foreground dark:border-slate-800 dark:text-slate-800 dark:bg-slate-400/30 dark:hover:bg-slate-800/60 dark:hover:text-white',
				secondary:
					'bg-secondary text-secondary-foreground hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline',
				add: 'bg-gray-300/70 border-[1px] border-stone-400 hover:bg-gray-300/90',
			},
			size: {
				default: 'h-10 px-4 py-2 rounded-[5px]',
				sm: 'h-9 rounded-[5px] px-3',
				lg: 'h-11 rounded-[5px] px-6 text-[17px]',
				icon: 'h-10 w-10',
				add: 'py-3 ',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
)

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		return (
			<button
				className={cn(buttonVariants({ variant, size }), className)}
				ref={ref}
				{...props}
			/>
		)
	}
)
Button.displayName = 'Button'

export { Button, buttonVariants }
