'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { createBookingRequest } from '@/lib/supabase/bookings';

export type BookingHost = {
  id: string | number;
  name: string;
  price: number;
  category: string;
  verified?: boolean;
};

const steps = ['Date', 'Time', 'Length', 'Place', 'Review'];
const dateOptions = ['Today', 'Thu 14', 'Fri 15', 'Sat 16'];
const timeOptions = ['5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM'];
const durationOptions = [1, 2, 3, 4];
const placeOptions = [
  { name: 'Café Luna', detail: 'Central Plaza • 3 min walk' },
  { name: 'Riverside Bench', detail: 'Public park • 5 min walk' },
  { name: 'City Library Atrium', detail: 'Indoor seating • safe and central' },
];

function buildStartsAt(selectedDate: string, selectedTime: string) {
  const now = new Date();
  const targetDay = selectedDate === 'Today' ? now : new Date();

  if (selectedDate === 'Today') {
    targetDay.setHours(0, 0, 0, 0);
  } else {
    const dayNumber = Number.parseInt(selectedDate.split(' ')[1] ?? '0', 10);
    if (!Number.isNaN(dayNumber)) {
      targetDay.setDate(now.getDate() + Math.max(1, dayNumber - now.getDate() + 1));
    }
    targetDay.setHours(0, 0, 0, 0);
  }

  const [time, meridiem] = selectedTime.split(' ');
  const [hourString, minuteString] = time.split(':');
  let hour = Number.parseInt(hourString ?? '0', 10);
  const minute = Number.parseInt(minuteString ?? '0', 10);

  if (meridiem === 'PM' && hour < 12) {
    hour += 12;
  }

  if (meridiem === 'AM' && hour === 12) {
    hour = 0;
  }

  targetDay.setHours(hour, minute, 0, 0);
  return targetDay.toISOString();
}

export function BookingFlow({
  host,
  isOpen,
  onClose,
}: {
  host: BookingHost;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(dateOptions[1]);
  const [selectedTime, setSelectedTime] = useState(timeOptions[2]);
  const [selectedDuration, setSelectedDuration] = useState(2);
  const [selectedPlace, setSelectedPlace] = useState(placeOptions[0].name);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = host.price * selectedDuration;
  const bookingHostId = String(host.id);
  const isDbBookingReady = bookingHostId.includes('-');

  const requestSummary = useMemo(
    () => ({
      startsAt: buildStartsAt(selectedDate, selectedTime),
      durationHours: selectedDuration,
      placeName: selectedPlace,
    }),
    [selectedDate, selectedDuration, selectedPlace, selectedTime],
  );

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((value) => value + 1);
      return;
    }

    if (!isDbBookingReady) {
      setError('This host is not ready to receive booking requests yet.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await createBookingRequest({
        hostId: host.id,
        startsAt: requestSummary.startsAt,
        durationHours: requestSummary.durationHours,
        placeName: requestSummary.placeName,
      });
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to send the booking request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setCurrentStep((value) => Math.max(value - 1, 0));
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-slate-950/40"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            className="absolute inset-x-0 bottom-0 mx-auto max-w-[430px] rounded-t-[32px] bg-white pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-20px_50px_rgba(15,23,42,0.18)]"
          >
            <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-slate-200" />

            <div className="flex items-center justify-between px-4 pt-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Booking</p>
                <h3 className="mt-1 text-xl font-bold text-slate-900">{host.name}</h3>
              </div>
              <button
                type="button"
                aria-label="Close booking sheet"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="px-4 pt-4">
              <div className="grid grid-cols-5 gap-2">
                {steps.map((label, index) => (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${
                        index <= currentStep ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="text-[9px] font-medium text-slate-500">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="max-h-[58dvh] overflow-y-auto px-4 pb-20 pt-4">
              {currentStep === 0 && (
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Choose a date</h4>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {dateOptions.map((date) => (
                      <button
                        key={date}
                        type="button"
                        onClick={() => setSelectedDate(date)}
                        className={`min-h-[52px] rounded-2xl border px-3 text-left ${
                          selectedDate === date
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        <div className="text-sm font-semibold">{date}</div>
                        <div className="mt-1 text-xs text-slate-500">{date === 'Today' ? 'Available' : 'Open slots'}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Pick a time</h4>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {timeOptions.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`min-h-[52px] rounded-2xl border px-3 text-sm font-semibold ${
                          selectedTime === time
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h4 className="text-lg font-bold text-slate-900">How long?</h4>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {durationOptions.map((duration) => (
                      <button
                        key={duration}
                        type="button"
                        onClick={() => setSelectedDuration(duration)}
                        className={`min-h-[52px] rounded-2xl border px-3 ${
                          selectedDuration === duration
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        <div className="text-base font-semibold">{duration} hour{duration > 1 ? 's' : ''}</div>
                        <div className="text-xs text-slate-500">${host.price * duration}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Meeting place</h4>
                  <div className="mt-4 space-y-3">
                    {placeOptions.map((place) => (
                      <button
                        key={place.name}
                        type="button"
                        onClick={() => setSelectedPlace(place.name)}
                        className={`flex w-full items-center justify-between rounded-2xl border p-3 text-left ${
                          selectedPlace === place.name
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-slate-900">{place.name}</p>
                          <p className="text-sm text-slate-500">{place.detail}</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                          Public
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Review</h4>

                  <div className="mt-4 rounded-2xl bg-slate-50 p-3">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>{selectedDate}</span>
                      <span>{selectedTime}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                      <span>{selectedDuration} hour{selectedDuration > 1 ? 's' : ''}</span>
                      <span>{selectedPlace}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                      <span>Estimated total</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {error ? (
                    <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
                  ) : (
                    <p className="mt-5 rounded-2xl bg-orange-50 p-3 text-sm font-medium text-orange-700">
                      Request sent. Payment is added in the next release.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="absolute inset-x-0 bottom-0 border-t border-slate-200 bg-white px-4 pb-4 pt-3 safe-bottom">
              <div className="flex items-center gap-3">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="min-h-[44px] flex-1 rounded-full border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 disabled:opacity-60"
                  >
                    <span className="inline-flex items-center gap-2">
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                      Back
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="min-h-[44px] flex-1 rounded-full bg-orange-500 px-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    {isSubmitting ? 'Sending...' : currentStep === 4 ? 'Send request' : 'Continue'}
                    {currentStep < 4 && !isSubmitting && <ChevronRight className="h-4 w-4" aria-hidden="true" />}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
