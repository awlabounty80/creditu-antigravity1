import * as React from "react"
export const Select = ({ children, value, onValueChange }: any) => <div data-value={value}>{children}</div>
export const SelectGroup = ({ children }: any) => <div>{children}</div>
export const SelectValue = ({ placeholder }: any) => <span>{placeholder}</span>
export const SelectTrigger = ({ children, className }: any) => <div className={className}>{children}</div>
export const SelectContent = ({ children, className }: any) => <div className={className}>{children}</div>
export const SelectLabel = ({ children }: any) => <div>{children}</div>
export const SelectItem = ({ children, value }: any) => <div data-value={value}>{children}</div>
export const SelectSeparator = () => <hr />
