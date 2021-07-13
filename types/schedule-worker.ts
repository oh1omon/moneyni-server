export default abstract class ScheduleWorker {
	/**
	 * This is the interval in cron format
	 */
	public static interval: string

	/**
	 * This is an abstract callback method ( Whoaoaoa )
	 */
	public static readonly callback: () => void
}
