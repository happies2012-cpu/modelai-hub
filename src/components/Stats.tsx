export const Stats = () => {
  const stats = [
    { value: '10K+', label: 'Verified Models' },
    { value: '500+', label: 'Partner Agencies' },
    { value: '1M+', label: 'Successful Bookings' },
    { value: '50+', label: 'Countries' },
  ];

  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2 text-gold">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-primary-foreground/80">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
