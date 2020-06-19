import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Dropdown2 from 'components/Dropdown2/Dropdown.js';
import actions from 'actions';
import selectors from 'selectors';
import { useTranslation } from 'react-i18next';

import Measure from 'react-measure';

import "./Ribbons.scss";

const Ribbons = ({ screens, currentScreen, setToolbarScreen }) => {
  const [t] = useTranslation();
  const [ribbonsWidth, setRibbonsWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [hasEnoughSpace, setHasEnoughSpace] = useState(false);
  const ribbonsRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    const ribbonsRight = ribbonsRef.current.getBoundingClientRect().right;
    const containerLeft = containerRef.current.getBoundingClientRect().left;
    const remainingSpace = ribbonsRight - containerLeft;
    if (remainingSpace - ribbonsWidth > 0) {
      setHasEnoughSpace(true);
    } else {
      setHasEnoughSpace(false);
    }
  }, [ribbonsWidth, containerWidth]);

  return (
    <Measure
      bounds
      innerRef={containerRef}
      onResize={({ bounds }) => {
        setContainerWidth(bounds.width);
      }}
    >
      {({ measureRef }) => (
        <div
          className="ribbons-container"
          ref={measureRef}
        >
          <Measure
            bounds
            innerRef={ribbonsRef}
            onResize={({ bounds }) => {
              setRibbonsWidth(bounds.width);
            }}
          >
            {({ measureRef }) => (
              <div
                ref={measureRef}
                className={classNames({
                  "ribbons": true,
                  "is-hidden": !hasEnoughSpace,
                })}
              >
                {Object.keys(screens).map(key =>
                  <div
                    key={key}
                    className={classNames({
                      "ribbon-group": true,
                      "active": key === currentScreen,
                    })}
                    onClick={() => {
                      setToolbarScreen(key);
                    }}
                  >
                    {t(`option.toolbarScreen.${key}`)}
                  </div>)}
              </div>
            )}
          </Measure>
          <div
            className={classNames({
              "ribbons": true,
              "is-hidden": hasEnoughSpace,
            })}
          >
            <Dropdown2
              items={Object.keys(screens)}
              translationPrefix="option.toolbarScreen"
              currentSelectionKey={currentScreen}
              onClickItem={screen => {
                setToolbarScreen(screen);
              }}
            />
          </div>
        </div>
      )}
    </Measure>
  );
};

const mapStateToProps = state => ({
  screens: state.viewer.headers.tools,
  currentScreen: selectors.getScreen(state),
});

const mapDispatchToProps = {
  setToolbarScreen: actions.setToolbarScreen,
};

const ConnectedRibbons = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Ribbons);

export default ConnectedRibbons;