import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, Divider, Skeleton } from '@nextui-org/react';
import { isSlot } from '../Slot';
import clsx from 'clsx';

export const CardBase = ({ title, async = false, skeletonlines = 6, className, children }) => {
    const headerSlot = React.Children.toArray(children).find(child => isSlot('header', child));
    const bodySlot = React.Children.toArray(children).find(child => isSlot('body', child));
    const footerSlot = React.Children.toArray(children).find(child => isSlot('footer', child));

    const [isLoaded, setLoaded] = useState(true);

    useEffect(() => {
        if (async) setLoaded(false);
    }, [async, bodySlot]);

    return (
        <Card className={`'border-sm' ${className}`} shadow='sm' radius='sm'>
            {(title || headerSlot) && (
                <>
                    <CardHeader className='flex justify-between'>
                        {title && <h2 className='text-2xl'>{title}</h2>}
                        {headerSlot.props.children}
                    </CardHeader>
                    <Divider />
                </>
            )}
            {!isLoaded ? <CardBody>
                {bodySlot ? bodySlot.props.children : children}
            </CardBody> :
                <div className="space-y-3 p-3">
                    {Array(skeletonlines).fill(0).map((_, index) => (
                        <Skeleton className="rounded-lg" key={index}>
                            <div className="h-5 w-full rounded-lg bg-secondary"></div>
                        </Skeleton>
                    ))}
                </div>
            }
            {footerSlot && (
                <CardFooter>
                    {footerSlot.props.children}
                </CardFooter>
            )}
        </Card>
    )
}
