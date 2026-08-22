import './SponsorBanner.css';
import sponsorConfig from './sponsorConfig';

const sponsorLogoModules = import.meta.glob('../assets/sponser/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  import: 'default',
});

const sponsorImagesByFileName = Object.entries(sponsorLogoModules).reduce((lookup, [filePath, imageUrl]) => {
  const fileName = filePath.split('/').pop();
  lookup[fileName] = imageUrl;
  return lookup;
}, {});

const sponsorEntries = sponsorConfig
  .map((sponsor) => ({
    ...sponsor,
    imageUrl: sponsorImagesByFileName[sponsor.logo] || sponsorImagesByFileName[`${sponsor.logo}.png`] || sponsorImagesByFileName[`${sponsor.logo}.jpg`] || sponsorImagesByFileName[`${sponsor.logo}.jpeg`] || sponsorImagesByFileName[`${sponsor.logo}.webp`] || sponsorImagesByFileName[`${sponsor.logo}.svg`],
  }))
  .sort((firstSponsor, secondSponsor) => firstSponsor.name.localeCompare(secondSponsor.name));

const sponsorEntriesLoop = sponsorEntries.length > 1 ? [...sponsorEntries, ...sponsorEntries] : sponsorEntries;

const SponsorBanner = () => {
  return (
    <div className="sponsor-banner">
      <div className="sponsor-content">
        <span className="sponsor-label">Powered by</span>
        <div className="sponsor-marquee" aria-label="Sponsor logos">
          {sponsorEntries.length > 0 ? (
            <div className="sponsor-track">
              {sponsorEntriesLoop.map((sponsor, index) => (
                <div className="sponsor-card" key={`${sponsor.name}-${index}`}>
                  <a
                    className="sponsor-card__link"
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="sponsor-logo sponsor-logo--compact">
                      {sponsor.imageUrl ? (
                        <img
                          src={sponsor.imageUrl}
                          alt={`${sponsor.name} sponsor logo`}
                          className="sponsor-image"
                          style={{ objectFit: sponsor.logoFit || 'contain' }}
                        />
                      ) : (
                        <span className="logo-text">No logo</span>
                      )}
                    </div>
                    <h3 className="sponsor-name sponsor-name--compact">{sponsor.name}</h3>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="sponsor-item sponsor-item--empty">
              <div className="sponsor-logo sponsor-logo--empty">
                <span className="logo-text">Sponsor</span>
              </div>
              <div className="sponsor-details">
                <h3 className="sponsor-name">Add sponsor details</h3>
                <p className="sponsor-tagline">Edit src/components/sponsorConfig.js and add matching logo files in src/assets/sponser.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SponsorBanner;
