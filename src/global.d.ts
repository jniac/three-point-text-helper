// export * from 'three'

declare module '*.frag' {
	const value: string
	export default value
}

declare module '*.vert' {
	const value: string
	export default value
}

declare module "*!text" {
  const content: string;
  export default content;
}