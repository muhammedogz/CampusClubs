import {
  Link as ReactRouterLink,
  LinkProps as ReactRouterLinkProps,
} from 'react-router-dom';
import { Routes } from 'src/data/routes';
import { generateRoute } from 'src/utils/urlUtils';

type LinkProps = ReactRouterLinkProps;

export const Link = ({ to, ...rest }: LinkProps) => {
  return (
    <ReactRouterLink
      style={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
      }}
      to={generateRoute(to as Routes)}
      {...rest}
    />
  );
};
