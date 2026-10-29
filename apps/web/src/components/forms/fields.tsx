'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import { AlertCircle, Check, ChevronDown } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export const inputClass =
  'h-12 w-full border border-control bg-black px-3.5 text-base text-ink outline-none focus:border-accent focus:outline-2 focus:outline-accent focus:outline-offset-0 aria-invalid:border-danger-border disabled:opacity-55';

type FieldProps = {
  id: string;
  label: string;
  required?: boolean;
  optionalLabel?: string;
  error?: string;
  children: ReactNode;
  className?: string;
};

export function Field({ id, label, required, optionalLabel, error, children, className }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label className="font-medium text-sm" htmlFor={id}>
        {label}
        {required ? ' *' : optionalLabel ? <span className="font-normal text-muted"> {optionalLabel}</span> : null}
      </label>
      {children}
      {error && <FieldError id={`${id}-err`}>{error}</FieldError>}
    </div>
  );
}

export function FieldError({ id, children, className }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <p className={cn('m-0 flex items-center gap-1.5 text-[13px] text-danger leading-[18px]', className)} id={id}>
      <AlertCircle aria-hidden size={14} />
      {children}
    </p>
  );
}

export function TextInput({ error, ...props }: ComponentProps<'input'> & { error?: string }) {
  return (
    <input
      aria-describedby={error ? `${props.id}-err` : undefined}
      aria-invalid={error ? true : undefined}
      className={inputClass}
      {...props}
    />
  );
}

export function TextArea({ error, ...props }: ComponentProps<'textarea'> & { error?: string }) {
  return (
    <textarea
      aria-describedby={error ? `${props.id}-err` : undefined}
      aria-invalid={error ? true : undefined}
      className={cn(inputClass, 'h-auto min-h-[120px] resize-y py-3 leading-6')}
      {...props}
    />
  );
}

export function ErrorSummary({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 border border-danger-border bg-danger-surface px-4 py-3.5 text-sm" role="alert">
      <AlertCircle aria-hidden className="mt-0.5 shrink-0 text-danger" size={18} />
      <span>{children}</span>
    </div>
  );
}

type SelectProps = {
  id: string;
  name: string;
  placeholder: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

/** Styled Base UI select; submits its value through a hidden input named `name`. */
export function Select({ id, name, placeholder, options, disabled, defaultValue, onValueChange }: SelectProps) {
  return (
    <BaseSelect.Root
      defaultValue={defaultValue ?? null}
      disabled={disabled}
      items={options}
      name={name}
      onValueChange={(value) => onValueChange?.(String(value))}
    >
      <BaseSelect.Trigger
        className={cn(
          inputClass,
          'flex cursor-pointer items-center justify-between text-left data-placeholder:text-muted'
        )}
        id={id}
      >
        <BaseSelect.Value placeholder={placeholder} />
        <BaseSelect.Icon>
          <ChevronDown aria-hidden size={18} />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner alignItemWithTrigger={false} className="z-[70] outline-none" sideOffset={4}>
          <BaseSelect.Popup className="min-w-(--anchor-width) border border-control bg-black py-1 shadow-xl transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0">
            <BaseSelect.List>
              {options.map((option) => (
                <BaseSelect.Item
                  className="flex min-h-11 cursor-pointer items-center justify-between gap-4 px-3.5 text-base outline-none data-highlighted:bg-white/8 data-selected:text-accent"
                  key={option.value}
                  value={option.value}
                >
                  <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                  <BaseSelect.ItemIndicator>
                    <Check aria-hidden size={16} />
                  </BaseSelect.ItemIndicator>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}

/** Off-screen honeypot + render timestamp; real people never touch these. */
export function SpamTraps({ startedAt }: { startedAt: number }) {
  return (
    <>
      <div aria-hidden className="-left-[9999px] absolute h-px w-px overflow-hidden">
        <label>
          Website
          <input autoComplete="off" name="website" tabIndex={-1} type="text" />
        </label>
      </div>
      <input name="started_at" type="hidden" value={startedAt} />
    </>
  );
}
