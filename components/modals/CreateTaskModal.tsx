'use client'

import { useWidth } from '@/hooks'
import { useCreateTaskModal } from '@/hooks/useCreateTaskModal'
import cn from 'classnames'
import isBefore from 'date-fns/isBefore'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Worm, X } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Modal from 'react-modal'
import Switch from 'react-switch'
import { DatePicker } from 'rsuite'
import { useTaskContext } from '../providers'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'

interface CreateTaskModalProps {
	isOpen: boolean
	onClose: () => void
}

type FormValues = {
	title: string
	description: string
	category: string
	startTime: Date
	endTime: Date
}

export const CreateTaskModal: FC<CreateTaskModalProps> = ({
	isOpen,
	onClose,
}) => {
	const width = useWidth()
	const isMobile = width < 945 ? true : false
	const searchParams = useSearchParams()
	const { updateQueryParam } = useCreateTaskModal()
	const { handleCreate } = useTaskContext()
	const [enabled, setEnabled] = useState(true)
	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: {
			title: '',
			description: '',
			category: '',
			startTime: new Date(),
			endTime: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
		},
		mode: 'onChange',
	})

	useEffect(() => {
		const category = searchParams.get('category')
		const title = searchParams.get('title')
		const description = searchParams.get('description')
		if (category) setValue('category', category)
		if (title) setValue('title', title)
		if (description) setValue('description', description)
	}, [searchParams, setValue])

	const onSubmit = (data: FormValues) => {
		handleCreate(data)
		onClose()
	}

	const toggleStartTime = () => setEnabled(prev => !prev)

	const handleInputChange = (id: keyof FormValues, value: string) => {
		setValue(id, value)
		updateQueryParam(id, value)
	}

	if (!isOpen) return null

	return (
		<AnimatePresence>
			{isOpen && (
				<Modal
					isOpen={isOpen}
					onRequestClose={onClose}
					contentLabel='CreateTask Modal'
					ariaHideApp={false}
					style={{
						overlay: {
							backgroundColor: 'rgba(100, 0, 0, 0.45)',
							display: 'flex',
							justifyContent: 'center',
							zIndex: 6,
							backdropFilter: 'blur(2px)',
							height: '100%',
							overflow: 'auto',
						},
						content: {
							position: 'relative',
							inset: 'auto',
							padding: '0',
							border: 'none',
							background: 'none',
							borderRadius: '5px',
							width: '100%',
							maxWidth: '900px',
							overflow: 'hidden',
							margin: '0 auto',
							height: width < 1000 ? '100vh' : 'auto',
						},
					}}
				>
					<motion.div
						initial={{ y: -10, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						transition={{ duration: 0.15 }}
						className={cn(
							'p-2 py-3 md:p-5 md:mx-2 md:mt-10 relative bg-orange-200 text-black dark:bg-slate-600 dark:text-white'
						)}
						style={{
							height: width < 1000 ? '100vh mt-0' : 'auto',
						}}
					>
						<div className='flex flex-col gap-1 w-full'>
							<div className='grid gap-2 pb-3 border-b-2 border-yellow-400'>
								<h1 className='flex items-center gap-2 text-[28px] tracking-wider font-bold'>
									<Worm className='w-12 h-12 text-pink-500' />
									Create Task!
								</h1>
								<p className='font-semibold flex items-center gap-[5px] px-2 text-sm'>
									<span className='tracking-[5px] text-slate-500 dark:text-slate-300'>
										////
									</span>
									"Master Your Minutes: Streamline Your Schedule for Success"
									<span className='tracking-[5px] text-slate-500 dark:text-slate-300'>
										////
									</span>
								</p>
							</div>
						</div>
						<form className='pt-3 grid gap-2' onSubmit={handleSubmit(onSubmit)}>
							<div className='grid grid-cols-2 w-full gap-x-3 pb-2 border-b-2 border-yellow-200'>
								<span className='col-span-2 flex items-center gap-2 text-sm tracking-wide text-gray-700 font-semibold italic dark:text-gray-300'>
									<Switch
										onChange={toggleStartTime}
										checked={!enabled}
										offColor='#84868a'
										onColor='#91db7d'
										width={45}
										height={22}
										uncheckedIcon={<></>}
										checkedIcon={<></>}
										checkedHandleIcon={
											<Check className='ml-[2px] pt-[5px]' size={16} />
										}
										uncheckedHandleIcon={
											<X className='ml-[2px] pt-[5px]' size={16} />
										}
									/>
									:enable to change start time of task for future goals!
								</span>
								<label
									htmlFor='timeStart'
									className='text-center font-bold text-lg'
								>
									Start Time:
									<Controller
										name='startTime'
										control={control}
										disabled={enabled}
										render={({ field }) => (
											<DatePicker
												{...field}
												limitStartYear={2024}
												size='lg'
												oneTap
												block
												shouldDisableDate={date => isBefore(date, new Date())}
											/>
										)}
									/>
								</label>
								<label
									htmlFor='timeEnd'
									className='text-center font-bold text-lg'
								>
									End Time:
									<Controller
										name='endTime'
										control={control}
										render={({ field }) => (
											<DatePicker
												{...field}
												limitEndYear={1000}
												size='lg'
												oneTap
												className='z-[100]'
												style={{
													zIndex: '1000 ',
												}}
												block
												shouldDisableDate={date => isBefore(date, new Date())}
											/>
										)}
									/>
								</label>
							</div>
							<label
								htmlFor='title'
								className='grid gap-1 tracking-wider text-lg font-bold'
							>
								Title:
								<Controller
									name='title'
									control={control}
									rules={{ required: 'Title is required' }}
									render={({ field }) => (
										<Input
											{...field}
											placeholder='Here is your title...'
											className='font-semibold bg-orange-300/70'
											onChange={e => handleInputChange('title', e.target.value)}
										/>
									)}
								/>
								{errors.title && (
									<span className='text-red-500 dark:text-red-300 text-[10px] leading-[10px]'>
										{errors.title.message}
									</span>
								)}
							</label>
							<label
								htmlFor='category'
								className='grid gap-1 tracking-wider text-lg font-bold'
							>
								Category:
								<Controller
									name='category'
									control={control}
									rules={{ required: 'Category is required' }}
									render={({ field }) => (
										<Input
											{...field}
											className='font-semibold bg-orange-300/70'
											placeholder='Here is your category...'
											onChange={e =>
												handleInputChange('category', e.target.value)
											}
										/>
									)}
								/>
								{errors.category && (
									<span className='text-red-500 dark:text-red-300 text-[10px] leading-[10px]'>
										{errors.category.message}
									</span>
								)}
							</label>
							<label
								htmlFor='description'
								className='grid gap-1 tracking-wider text-lg font-bold'
							>
								Description:
								<Controller
									name='description'
									control={control}
									rules={{ required: 'Description is required' }}
									render={({ field }) => (
										<Textarea
											{...field}
											placeholder='Here is your description...'
											className='font-semibold bg-orange-300/70'
											onChange={e =>
												handleInputChange('description', e.target.value)
											}
										/>
									)}
								/>
								{errors.description && (
									<span className='text-red-500 dark:text-red-300 text-[10px] leading-[10px]'>
										{errors.description.message}
									</span>
								)}
							</label>
							<Button className='w-full mt-auto' type='submit'>
								Create Task
							</Button>
						</form>
						<Button
							className='absolute top-1 right-1 hover:text-white'
							variant='ghost'
							size='sm'
							onClick={onClose}
						>
							<X className='w-6 h-6' />
						</Button>
					</motion.div>
				</Modal>
			)}
		</AnimatePresence>
	)
}