'use client';
import { Children } from "react";

export default function FadeInGrid({children}:{children:React.ReactNode[]}){
    return(
        <div className="container mx-auto grid max-w-screen-lg grid-cols-3 gap-4">
            {
                Children.toArray(children).map((child, idx)=>(
                    <div
                        key={idx}
                        style={{
                            opacity:0,
                            animation:"fadeInUp 0.5s ease-out forwards",
                            animationDelay: `${idx * 100}ms`
                        }}
                    >
                        {child}
                    </div>
                ))
            }
        </div>
    )
}